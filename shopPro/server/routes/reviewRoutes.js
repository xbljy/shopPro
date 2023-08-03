const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController.js");

const router = express.Router();

// 获取商品评论
router
  .route("/get-product-reviews/:productId")
  .get(reviewController.getAllReviews);

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin"), reviewController.getAllReviews)
  .post(reviewController.setProductUserIds, reviewController.createReview)
  .delete(authController.restrictTo("admin"), reviewController.deleteAllReview);

router
  .route("/get-my-reviews")
  .get(reviewController.setUserId, reviewController.getMyReviews);

router
  .route("/:id")
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
