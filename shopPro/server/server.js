const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("出现异常");
  console.log(err.name, err.message);
  process.exit(1);
});

// 获取环境变量
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app.js");

// 连接数据库
const DB = process.env.CONNECTION.replace("<PASSWORD>", process.env.PASSWORD)
                                .replace("<USE>", process.env.USE)
                                .replace("<PORT>", process.env.PORT)
                                .replace("<DATABASE>", process.env.DATABASE)
                                .replace("<IP>", process.env.IP);
console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("数据库连接成功");
  });

// 启动服务
const port = process.env.LISTENPORT || 8000;
const server = app.listen(port, () => {
  console.log(`server is listening to port: ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("出现异常");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("服务即将关闭");
  server.close(() => {
    console.log("服务已关闭");
  });
});
