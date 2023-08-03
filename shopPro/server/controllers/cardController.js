const factory = require("./handlerFactory.js");
const Card = require("../models/Card.js");
const Product = require("../models/Product.js");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError.js");

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.getTheMostAddedToCardProducts = catchAsync(async (req, res, next) => {
  const products = await Card.aggregate([
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

exports.getMyBag = factory.getAll(Card, true, {
  path: "product images",
});

const validateNumberOfQuanity = (
  product,
  numberOfOrders,
  selectedSize,
  selectedProperty
) => {
  let productQuantity;
  if (["accessories", "bags"].includes(product.category)) {
    productQuantity = product.properties.find(
      (property) => property.propertyName == selectedProperty
    ).quantity;
  } else {
    console.log(selectedProperty, "=============");
    productQuantity = product.properties
      .find((property) => property.propertyName == selectedProperty)
      .sizes.find((size) => size.size == selectedSize).quantity;
  }

  return {
    status: productQuantity >= numberOfOrders,
    quantity: productQuantity,
  };
};

exports.createCard = catchAsync(async (req, res, next) => {
  let card;
  const product = await Product.findById(req.body.product);
  if (
    !validateNumberOfQuanity(
      product,
      req.body.numberOfOrders,
      req.body.size,
      req.body.property
    ).status
  )
    return next(
      new AppError(
        "商品无库存，请联系客服",
        404
      )
    );
  if (["accessories", "bags"].includes(product.category)) {
    card = await Card.findOne({
      property: req.body.property,
      product: { _id: req.body.product },
      user: req.user.id,
    });
  } else {
    card = await Card.findOne({
      property: req.body.property,
      size: req.body.size,
      product: { _id: req.body.product },
      user: req.user.id,
    });
  }

  if (card) {
    return next(
      new AppError("下单成功", 500)
    );
  }

  const newCard = await Card.create(req.body);

  res.status(201).json({
    status: "success",
    data: newCard,
  });
});

exports.updateCard = catchAsync(async (req, res, next) => {
  const card = await Card.findById(req.params.id).populate({ path: "product" });
  const product = await Product.findById(card.product.id);
  const isValidQuantity = validateNumberOfQuanity(
    product,
    req.body.numberOfOrders,
    card.size,
    card.property
  );
  if (req.body.numberOfOrders && !isValidQuantity.status)
    return next(
      new AppError(
        `库存不足${isValidQuantity.quantity}，请联系客服`,
        404
      )
    );

  if (req.body.numberOfOrders) card.numberOfOrders = req.body.numberOfOrders;
  if (req.body.size) card.size = req.body.size;
  if (req.body.property) card.property = req.body.property;
  await card.save();
  res.status(200).json({
    status: "success",
    data: card,
  });
});

exports.deleteCard = factory.deleteOne(Card);

exports.getCard = factory.getOne(Card, "", true);

exports.deleteAllCards = factory.deleteItemsForAUser(Card);
exports.deleteItemsWithIds = factory.deleteItemByIds(Card);
