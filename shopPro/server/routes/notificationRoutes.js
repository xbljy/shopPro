const express = require("express");
const notificationController = require("./../controllers/notificationController.js");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(notificationController.getMyNotifications)
  .post(
    notificationController.setUserFromIds,
    notificationController.pushNotificationForOneUser
  )
  .delete(notificationController.deleteAllNotifications);

router
  .route("/pushNotificationForMultibleUsers")
  .post(notificationController.pushNotificationForMultibleUsers);

router
  .route("/:id")
  .patch(notificationController.makeAsRead)
  .delete(notificationController.deleteNotification);

router.route("/make-all-as-read").patch(notificationController.makeAllAsRead);

module.exports = router;
