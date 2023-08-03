const factory = require("./handlerFactory.js");
const Post = require("./../models/Post.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.setUserId = (req, res, next) => {
  if (!req.body.publisher) req.body.publisher = req.user.id;
  next();
};

exports.uploadPhotos = factory.uploadPhotos([
  {
    name: "images",
    maxCount: 4,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
]);

exports.resizeImages = factory.resizeImages({
  name: "post",
});

exports.isPublisher = catchAsync(async (req, res, next) => {
  const curPost = await Post.findById(req.params.id).select("publisher");
  if (req.user.role == "admin") return next();
  if (req.user.id !== curPost.publisher.id)
    return next(
      new AppError("您没有发布文章的权限", 401)
    );
  next();
});

exports.createPost = factory.createOne(Post, "publisher");

exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
