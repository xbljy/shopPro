const express = require("express");
const wishlistController = require("./../controllers/wishlistController.js");
const authController = require("./../controllers/authController.js");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(wishlistController.getMyWishlist)
  .post(wishlistController.setProductUserIds, wishlistController.createWishlist)
  .delete(wishlistController.deleteAllitems);

router
  .route("/delete-items-with-ids")
  .delete(wishlistController.deleteItemsWithIds);

router.route("/:productId").delete(wishlistController.deleteItem);

module.exports = router;
