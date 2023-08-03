const express = require("express");
const locationController = require("./../controllers/locationController.js");
const authController = require("./../controllers/authController.js");
const router = express.Router();

router.route("/").get(locationController.getAllLocations);
router.route("/:id").get(locationController.getOneLocation);

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .post(locationController.createLocation)
  .delete(locationController.deleteAllLocations);

router
  .route("/:id")
  .patch(locationController.updateLocation)
  .delete(locationController.deleteLocation);

module.exports = router;
