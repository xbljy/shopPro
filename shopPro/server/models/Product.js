const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: ["true", "请传入商品名称"],
    },
    description: {
      type: String,
      trim: true,
      required: ["true", "请传入商品详情"],
    },
    type: {
      type: String,
      required: ["true", "请传入商品类型"],
    },
    gender: {
      type: String,
    },
    age_group: {
      type: String,
    },
    ratingsAverage: {
      // (oldratingsQuantity * oldratingsAverage + newrating ) / newratingQuantity
      type: Number,
      default: 4.5,
      min: [1, "最少一颗星"],
      max: [5, "最多五颗星"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      enum: ["新鲜水果", "海鲜水产", "精选肉类", "冷饮冻食", "蔬菜蛋品"],
      required: [true, "请传入一个类目"],
    },
    collection_season: {
      type: [String],
      enum: ["春季", "夏季", "秋季", "冬季"],
      required: [true, "请传入一个季节"],
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    viewers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    buyers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    numberOfViewers: {
      type: Number,
      default: 0,
      min: 0,
    },
    global_discount: { type: Number, min: 0, max: 1, default: 0 },
    properties: [
      {
        propertyName: {
          type: String,
          required: [true, "请传入一个颜色"],
        },
        price: {
          type: Number,
          required: ["true", "请传入价格"],
        },
        priceDiscount: {
          type: Number,
          min: 0,
          max: 1,
          default: 0,
        },
        propertyName: String,
        quantity: { type: Number, default: 0, min: 0 },
        images: [
          {
            small_image: String,
            medium_image: String,
            large_image: String,
          },
        ],

        sizes: [
          { size: String, quantity: { type: Number, default: 0, min: 0 } },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.index({ createdAt: -1 });
productSchema.index({ categories: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
