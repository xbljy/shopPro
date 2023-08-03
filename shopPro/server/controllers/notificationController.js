const factory = require("./handlerFactory.js");
const Notification = require("./../models/Notification.js");
const catchAsync = require("./../utils/catchAsync");

exports.setUserFromIds = (req, res, next) => {
  if (!req.body.from) req.body.from = req.user.id;
  if (!req.body.user) req.body.user = req.query.to_user_id;

  next();
};

exports.pushNotificationForOneUser = factory.createOne(Notification);

exports.pushNotificationForMultibleUsers = catchAsync(
  async (req, res, next) => {
    const notifications = req.body.users.map((user) => {
      return {
        from: req.user.id,
        description: req.body.description,
        title: req.body.title,
        user,
      };
    });

    const data = await Notification.insertMany(notifications);

    res.status(201).json({
      status: "success",
      data,
    });
  }
);

exports.deleteNotification = factory.deleteOne(Notification, true);
exports.deleteAllNotifications = factory.deleteItemsForAUser(Notification);

exports.makeAsRead = catchAsync(async (req, res, next) => {
  await Notification.findByIdAndUpdate(req.params.id, { seen: true });

  res.status(200).json({
    status: "success",
  });
});

exports.makeAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany({ seen: false }, { $set: { seen: true } });
  res.status(200).json({
    status: "success",
  });
});

exports.getMyNotifications = factory.getAll(Notification, true);
