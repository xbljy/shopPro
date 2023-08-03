const express = require("express");
const postController = require("./../controllers/postController.js");
const authController = require("./../controllers/authController.js");
const router = express.Router();

router.route("/").get(postController.getAllPosts);

router.route("/:id").get(postController.getPost);

router.use(
  authController.protect,
  authController.restrictTo("admin", "blogger")
);

router
  .route("/")
  .post(
    postController.uploadPhotos,
    postController.resizeImages,
    postController.setUserId,
    postController.createPost
  );

router
  .route("/:id")
  .patch(
    postController.isPublisher,
    postController.uploadPhotos,
    postController.resizeImages,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;
