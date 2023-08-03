const User = require("./../models/User.js");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
/*
  ========================================================================
 创建jwt token
  ========================================================================
*/
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/*
  ========================================================================
  发送token给客户端
  ========================================================================
*/
const createSendToken = (user, statusCode, res, req) => {
  // 创建token
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: req.secure || req.headers("x-forwarded-proto") === "https",
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

/*
  ========================================================================
  注册
  ========================================================================
*/
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // 发送token
  createSendToken(newUser, 201, res, req);
});

/*
  ========================================================================
  登录
  ========================================================================
*/
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password)
  // 判断邮箱和用户是否存在
  if (!email || !password)
    return next(new AppError("请输入账号密码", 400));

  // 检查账号密码是否正确
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("账号或密码错误", 401));

  // 发送token到客户端
  createSendToken(user, 200, res, req);
});

/*
  ========================================================================
  退出
  ========================================================================
*/
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

/*
  ========================================================================
  校验访问权限
  ========================================================================
*/
exports.protect = catchAsync(async (req, res, next) => {
  // 获取token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 判断是否有token
  if (!token) return next(new AppError("账号未登录", 401));

  // 校验token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 判断用户是否存在
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError("用户不存在", 401));

  // 修改密码后校验token
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "您已修改密码，请重新登录",
        401
      )
    );
  }

  // 赋予访问权限
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
/*
  ========================================================================
  校验是否登录
  ========================================================================
*/
exports.isLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (token) {
    try {
      // 1) 校验token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 2) 校验用户是否存在
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(200).json({ currentUser: false });
      }

      // 3) 检测是否修改密码
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(200).json({ currentUser: false });
      }

      // 用户登录成功
      res.status(200).json({
        status: "success",
        currentUser,
      });
      return;
    } catch (err) {
      return;
    }
  }

  res.status(200).json({ currentUser: false });
};

/*
  ========================================================================
  权限校验
  ========================================================================
*/
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "您没有权限进行此操作",
          401
        )
      );
    }
    next();
  };
};

/*
  ========================================================================
  忘记密码
  ========================================================================
*/
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 判断邮箱是否存在
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("此邮箱尚未注册", 404));

  // 重置token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // token发送到邮箱
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: `token已发送到邮箱!${email}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("发送到邮箱失败，请稍后重试", 500)
    );
  }
});

/*
  ========================================================================
  通过token重置密码
  ========================================================================
*/
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 获取token，用来获取user
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 判断用户是否存在
  if (!user)
    return next(new AppError("token已过期", 400));

  // 如果用户存在则重置密码
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 用当前用户登录，并发送token

  createSendToken(user, 201, res, req);
});

/*
  ========================================================================
  修改密码
  ========================================================================
*/
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 获取用户
  const user = await User.findById(req.user.id).select("+password");

  // 判断用户是否存在
  if (!user) return next(new AppError("用户不存在", 404));
  // 判断密码是否正确
  if (
    !req.body.passwordCurrent ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError("密码错误", 401));
  }
  // 修改密码
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 用当前用户登录，并发送token

  createSendToken(user, 201, res, req);
});
