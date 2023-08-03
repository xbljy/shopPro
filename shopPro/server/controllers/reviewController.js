const factory = require("./handlerFactory.js");
const Review = require("./../models/Review.js");

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.product) req.body.product = req.query.product;
  console.log(req.body);
  next();
};

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getMyReviews = factory.getAll(Review, true);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review, {
  path: "user",
  select: "name photo",
});
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.deleteAllReview = factory.deleteAll(Review);
