const express = require("express");
const cardController = require("../controllers/cardController.js");
const authController = require("../controllers/authController.js");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/get-the-top-products")
  .get(cardController.getTheMostAddedToCardProducts);

router
  .route("/")
  .get(cardController.getMyBag)
  .post(cardController.setProductUserIds, cardController.createCard)
  .delete(cardController.deleteAllCards);

router.route("/delete-by-ids").delete(cardController.deleteItemsWithIds);

router
  .route("/:id")
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = router;
