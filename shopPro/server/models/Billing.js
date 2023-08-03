const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    orders: [
      {
        name: String,
        image: String,
        property: String,
        size: String,
        numberOfOrders: String,
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Billing必须有user字段"],
    },
    balance: {
      type: Number,
      required: [true, "Billing缺少balance字段"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    chargingStatus: {
      type: String,
      required: [true, "billing缺少chargingStatus字段"],
    },
    paymentStatus: {
      type: String,
      required: [true, "billing缺少paymentStatus"],
    },
    method: {
      type: String,
      required: [true, "billing缺少method字段"],
    },
    billingId: {
      type: String,
      required: [true, "billing缺少billingId字段"],
    },
    brand: {
      type: String,
    },
    country: {
      type: String,
    },
    last4: {
      type: String,
    },
    currency: {
      type: String,
    },

    time: {
      type: Date,
      required: [true, "billing缺少data字段"],
    },
  },
  {
    timestamps: true,
  }
);

billingSchema.pre(/^find/, function (next) {
  this.populate("user").populate("orders");
  next();
});

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
