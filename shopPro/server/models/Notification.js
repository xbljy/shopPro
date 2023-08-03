const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "请传入通知标题"],
    },
    description: {
      type: String,
      required: [true, "请传入通知内容"],
    },
    seen: {
      type: Boolean,
      default: false,
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "通知需要关联管理账号"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "通知需要关联用户"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
