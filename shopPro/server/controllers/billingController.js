const factory = require("./handlerFactory.js");
const Card = require("../models/Card.js");
const Product = require("../models/Product.js");
const Billing = require("./../models/Billing.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) 获取当前商品
  const cart = await Card.findById(req.params.cartId).populate({
    path: "product",
  });

  // 2) 创建支付信息

  // 3) 返回信息
  res.status(200).json({
    status: "success"
  });
});

exports.getAllBillings = factory.getAll(Billing);
exports.getOneBilling = factory.getOne(Billing);

exports.getMyBillings = factory.getAll(Billing, true);

exports.createPayment = catchAsync(async (req, res) => {
  const { cardIds } = req.body;
  // get all the cards data from database
  const cards = await Card.find({ _id: { $in: cardIds } }).populate({
    path: "product",
  });

  // 计算支付金额
  let amount = 0;
  cards.forEach((card) => {
    let item = card.product.properties.find(
      (property) => property.propertyName == card.property
    );

    const price = (() => {
      if (item.priceDiscount > 0) {
        return item.priceDiscount * item.price * 1;
      } else if (item.priceDiscount == 0 && card.product.global_discount > 0) {
        return card.global_discount * item.price * 1;
      }

      return item.price * 1;
    })();

    amount = amount + price * card.numberOfOrders * 1;
  });

  const metadata = {};
  cardIds.forEach((cardId, index) => {
    metadata["order_" + index] = cardId;
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...metadata,
        user: String(req.user._id),
        billingId: Math.floor(Math.random() * 10000) + Date.now(),
      },
    });

    res.status(200).json({
      status: "success",
      data: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

exports.createPayment = catchAsync(async (req, res, next) => {
  let event;

  // 处理活动信息
  if (event.type == "充值成功") {
    const { metadata, amount, payment_method_details, currency, status } =
      event.data.object;

    const userId = metadata.user;
    const billingId = metadata.billingId;
    delete metadata.user;
    delete metadata.billingId;

    // --------------------------------
    // GET CARDS
    const cardIds = Object.values(metadata);
    const cards = await Card.find({ _id: { $in: cardIds } }).populate({
      path: "product",
    });
    // --------------------------------
    // GET CARDS
    const ordersData = [];
    for (const key in cards) {
      const productId = cards[key].product.id;
      const product = await Product.findById(productId);

      // EXTRACT ORDER DATA FOR EACH CARD
      let orderData = null;
      if (["accessories", "bags"].includes(product.category)) {
        product.properties.find(
          (property) => property.propertyName == cards[key].property
        ).quantity = cards[key].numberOfOrders;
        orderData = {
          product: product.id,
          name: product.name,
          property: cards[key].property,
          numberOfOrders: cards[key].numberOfOrders,
          image: product.properties.find((property) => {
            if (property.propertyName == cards[key].property) return property;
          }).images[0].small_image,
        };
      } else {
        product.properties
          .find((property) => property.propertyName == cards[key].property)
          .sizes.find((size) => {
            if (size.size == cards[key].size) return size;
          }).quantity -= cards[key].numberOfOrders * 1;

        orderData = {
          product: product.id,
          name: product.name,
          property: cards[key].property,
          size: cards[key].size,
          numberOfOrders: cards[key].numberOfOrders,
          image: product.properties.find(
            (property) => property.propertyName == cards[key].property
          ).images[0].small_image,
        };
      }

      ordersData.push(orderData);

      if (product.buyers.findIndex((el) => el == userId) == -1) {
        product.buyers.push(userId);
      }

      await product.save();
    }

    if (ordersData.length == 0)
      return next(new AppError("something went very wrong", 500));

    // delete cards
    await Card.deleteMany({
      _id: { $in: cardIds },
    });

    // 创建支付订单
    await Billing.create({
      user: userId,
      orders: ordersData,
      chargingStatus: status,
      paymentStatus: "pending",
      method: "card",
      time: Date.now(),
      balance: amount,
      last4: payment_method_details["card"]["last4"],
      country: payment_method_details["card"]["country"],
      brand: payment_method_details["card"]["brand"],
      currency,
      billingId,
    });
  } else if (event.type == "付款成功") {
    const { metadata } = event.data.object;

    await Billing.findOneAndUpdate(
      { billingId: metadata.billingId },
      { paymentStatus: "succeeded" },
      { new: true, runValidators: true }
    );
  } else if (event.type == "付款失败") {
    const { metadata } = event.data.object;

    const billing = await Billing.findOneAndUpdate(
      { billingId: metadata.billingId },
      { paymentStatus: "failed" }
    );

    billing.orders.forEach(async (order) => {
      const product = await Product.findById(order.product);

      if (["accessories", "bags"].includes(product.category)) {
        product.properties.find(
          (property) => property.propertyName == order.property
        ).quantity += order.numberOfOrders;
      } else {
        product.properties
          .find((property) => property.propertyName == order.property)
          .sizes.find((size) => {
            if (size.size == order.size) return size;
          }).quantity += order.numberOfOrders;
      }

      const index = product.buyers.findIndex((el) => el == metadata.user);
      if (index > -1) product.buyers.splice(index, 1);

      await product.save();
    });
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  res.send({ recieved: true });
});
