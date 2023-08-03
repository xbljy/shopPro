const factory = require("./handlerFactory.js");
const Event = require("./../models/Event.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.uploadPhotos = factory.uploadPhotos([
  {
    name: "coverImage",
    maxCount: 1,
  },
]);

exports.resizeImages = factory.resizeImages({
  name: "event",
});

exports.createEvent = factory.createOne(Event);

exports.updateEvent = factory.updateOne(Event);
exports.deleteEvent = factory.deleteOne(Event);

exports.getAllEvents = factory.getAll(Event);
exports.getEvent = factory.getOne(Event);
