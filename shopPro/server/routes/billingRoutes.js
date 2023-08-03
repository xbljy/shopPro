const express = require("express");
const billingController = require("./../controllers/billingController.js");
const authController = require("./../controllers/authController.js");

const router = express.Router();

router.use(authController.protect);

// router.get("/checkout-session/:cardId", billingController.getCheckoutSession);
router.route("/get-my-billings").get(billingController.getMyBillings);

router.use(authController.restrictTo("admin"));
router.route("/").get(billingController.getAllBillings);
router.route("/:id").get(billingController.getOneBilling);

module.exports = router;
