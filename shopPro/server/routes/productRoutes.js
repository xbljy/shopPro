const productController = require("./../controllers/productController.js");
const {
  getTheMostAddedToCardProducts,
} = require("../controllers/cardController.js");

const {
  getTheMostWishlistedProducts,
} = require("./../controllers/wishlistController.js");

const cardRouter = require("./cardRoutes.js");
const wishlistRouter = require("./wishlistRoutes.js");
const authController = require("./../controllers/authController.js");

const express = require("express");
const router = express.Router();

router.use("/:productId/bag", cardRouter);
router.use("/:productId/wishlist", wishlistRouter);

router
  .route("/discount/add-global-discount")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.addDiscountToProducts
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteDiscountToProducts
  );

router
  .route("/discount/:id")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.addDiscountToPropertiesInProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteDiscountToPropertiesInProduct
  );

router
  .route("/get-the-Most-Added-To-Cart-products")
  .get(
    getTheMostAddedToCardProducts,
    productController.getAllProductsWithInIds
  );

router
  .route("/get-related-to-current-product")
  .get(
    productController.getRelatedToCurrentProduct,
    productController.getAllProducts
  );

router
  .route("/get-The-Most-Wishlisted-products")
  .get(
    getTheMostWishlistedProducts,
    productController.getAllProductsWithInIds,
    productController.getAllProducts
  );

router
  .route("/get-trendy-products")
  .get(productController.getTrendyProducts, productController.getAllProducts);

router
  .route("/get-recommended-products")
  .get(
    productController.getRecommendedProducts,
    productController.getAllProducts
  );

router
  .route("/get-newly-added-products")
  .get(
    productController.getNewlyAddedProducts,
    productController.getAllProducts
  );

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteAllProducts
  );

router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteOne
  );

router
  .route("/add-property/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadPhotos,
    productController.resizeImages,
    productController.createProperty
  );

router
  .route("/update-property/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadPhotos,
    productController.resizeImages,
    productController.updateProperty
  );

router
  .route("/delete-property/:id/:propertyName")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProperty
  );

module.exports = router;
