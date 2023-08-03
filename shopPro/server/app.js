const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const history = require("connect-history-api-fallback");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const productRouter = require("./routes/productRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const postRouter = require("./routes/postRoutes.js");
const eventRouter = require("./routes/eventRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const cardRouter = require("./routes/cardRoutes.js");
const wishlistRouter = require("./routes/wishlistRoutes.js");
const billingRouter = require("./routes/billingRoutes.js");
const notificationRouter = require("./routes/notificationRoutes.js");
const locationRouter = require("./routes/locationRoutes.js");

const billingController = require("./controllers/billingController");

const app = express();
app.enable("trust proxy");

app.use(compression());

// 全局中间件
// 解决跨域
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.options("*", cors());

// 静态文件托管
app.use(
  express.static(
    path.join(
      __dirname,
      `${process.env.NODE_ENV == "development" ? "../client/public" : "dist"}`
    )
  )
);

if (process.env.NODE_ENV !== "development") {
  app.use(history());
}

// 设置安全标头 防止常见网站攻击
// 相关文章 https://www.pythonthree.com/how-to-configure-security-headers-in-apache/
app.use(helmet());

app.post(
  "/payment",
  express.raw({ type: "application/json" }),
  billingController.createPayment
);
// 解析请求体的内容放到req.body中
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 防止NoSQL注入
app.use(mongoSanitize());

// 防止XSS
app.use(xss());

// 防止参数污染
app.use(
  hpp({
    whitelist: [
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "price",
      "date",
      "numberOfViewers",
      "sort",
    ],
  })
);

// 路由配置
app.use("/api/v1/product", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bag", cardRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/billing", billingRouter);

if (process.env.NODE_ENV !== "development") {
  app.get(/.*/, function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
  });
} else {
  app.all("*", (req, res, next) => {
    next(new AppError(`${req.originalUrl}未找到`, 404));
  });
}

app.use(globalErrorHandler);
module.exports = app;
