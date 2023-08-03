const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "请传入文章标题"],
    },
    description: {
      type: String,
      required: [true, "请传入文章内容"],
    },
    summary: {
      type: String,
      required: [true, "请传入活动简介"],
    },
    publisher: {
      type: mongoose.Schema.ObjectId,
      required: [true, "文章需要关联用户"],
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    coverImage: [
      {
        small_image: String,
        medium_image: String,
        large_image: String,
      },
    ],
    // viewedUsers: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //     unique: true,
    //   },
    // ],
    // numberOfViewers: {
    //   type: Number,
    //   default: 0,
    //   set: () => this.viewedUsers.length,
    // },
    images: [
      { small_image: String, medium_image: String, large_image: String },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

postSchema.index({ createdAt: -1 });

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "publisher",
    select: "name photo",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
