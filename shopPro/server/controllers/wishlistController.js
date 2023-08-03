const factory = require("./handlerFactory.js");
const Wishlist = require("./../models/Wishlist.js");
const catchAsync = require("./../utils/catchAsync");

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.getTheMostWishlistedProducts = catchAsync(async (req, res, next) => {
  const products = await Wishlist.aggregate([
    { $group: { _id: "$product", totalPersons: { $sum: 1 } } },
    { $sort: { totalPersons: -1 } },
    { $limit: 10 },
    { $group: { _id: null, ids: { $push: "$_id" } } },
    { $project: { _id: 0, totalPersons: 0 } },
  ]);

  let [ids] = products;
  req.query.ids = ids.ids;
  next();
});

exports.getMyWishlist = factory.getAll(Wishlist, true, { path: "product" });
exports.createWishlist = factory.createOne(Wishlist);
exports.deleteItem = factory.deleteItemByProduct(Wishlist);
exports.deleteAllitems = factory.deleteItemsForAUser(Wishlist, {});
exports.deleteItemsWithIds =
  factory.deleteItemsWithProductIdsForAUser(Wishlist);
