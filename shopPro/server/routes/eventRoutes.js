const express = require("express");
const eventController = require("./../controllers/eventController.js");
const authController = require("./../controllers/authController.js");
const router = express.Router();

router.route("/").get(eventController.getAllEvents);

router.route("/:id").get(eventController.getEvent);

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .post(
    eventController.uploadPhotos,
    eventController.resizeImages,
    eventController.createEvent
  );

router
  .route("/:id")
  .patch(
    eventController.uploadPhotos,
    eventController.resizeImages,
    eventController.updateEvent
  )
  .delete(eventController.deleteEvent);

module.exports = router;
