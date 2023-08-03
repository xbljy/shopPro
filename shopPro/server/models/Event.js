const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "请传入活动标题"],
    },
    description: {
      type: String,
      required: [true, "请传入活动内容"],
    },
    summary: {
      type: String,
      required: [true, "请传入活动简介"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startsIn: {
      type: Date,
      required: ["请传入活动开始日期"],
    },
    endsIn: {
      type: Date,
      required: ["请传入活动结束日期"],
    },
    coverImage: [
      {
        small_image: String,
        medium_image: String,
        large_image: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("save", function (next) {
  this.duration = Math.ceil(
    (new Date(this.startsIn) - new Date(this.endsIn)) / (1000 * 60 * 60 * 24)
  );

  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
