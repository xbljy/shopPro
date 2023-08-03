const factory = require("./handlerFactory.js");
const Location = require("./../models/Location.js");

exports.getAllLocations = factory.getAll(Location);
exports.getOneLocation = factory.getOne(Location);

exports.createLocation = factory.createOne(Location);

exports.updateLocation = factory.updateOne(Location);

exports.deleteLocation = factory.deleteOne(Location);
exports.deleteAllLocations = factory.deleteAll(Location);
