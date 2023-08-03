const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `重复字段: ${value} `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `数据异常 ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("token异常，请重新登录", 401);

const handleJWTExpiredError = () =>
  new AppError("token已过期，请重新登录", 401);

const sendErrorDev = (err, req, res) => {
  // A) api错误返回信息
  if (req.originalUrl.startsWith("/api")) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) 其他路径访问错误
  return res.status(err.statusCode).render("error", {
    title: "服务异常",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) api路径
  if (req.originalUrl.startsWith("/api")) {
    // 返回信息
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 其他异常
    // 1) 打印错误信息
    console.error("ERROR", err);
    // 2) 发送信息
    return res.status(500).json({
      status: "error",
      message: "服务异常",
    });
  }

  // 返回错误页面
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "服务异常",
      msg: err.message,
    });
  }
  // 其他错误
  // 1) 打印错误信息
  console.error("ERROR", err);
  // 2) 发送信息
  return res.status(err.statusCode).render("error", {
    title: "服务异常",
    msg: "请稍后重试",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
