const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "card需要关联user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "card需要关联product"],
    },
    property: {
      type: String,
      required: [true, "需要属性"],
    },
    size: {
      type: String,
    },
    numberOfOrders: {
      type: Number,
      min: [1, "需要提供一个数字"],
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

cardSchema.pre(/^find/, function (next) {
  this.populate({ path: "product" });
  next();
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
