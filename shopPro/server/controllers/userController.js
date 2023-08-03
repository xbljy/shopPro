const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.uploadUserPhoto = factory.uploadPhotos([
  {
    name: "photo",
    maxCount: 1,
  },
]);

exports.resizeUserPhoto = factory.resizeImages({
  name: "user",
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) 上送密码报错
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "当前路径不是修改密码路径，请访问 /updateMyPassword.",
        400
      )
    );
  }
  // 2) 过滤掉不允许修改的字段
  const filteredBody = filterObj(req.body, "name", "email", "phone");
  console.log(req.body);
  // 创建图片名称
  if (req.files && req.files.photo) {
    filteredBody.photo = {
      small_image: "small-" + req.files["photo"][0].filename,
      medium_image: "medium-" + req.files["photo"][0].filename,
      large_image: "large-" + req.files["photo"][0].filename,
    };
  }

  // 3) 更新用户文档
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = factory.getOne(User, {
  path: "posts bag wishlist myNotifications",
});
exports.getAllUsers = factory.getAll(User);

// 当前方法不修改密码
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
