const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    information: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{3}-\d{4}-\d{4}/.test(v);
        },
        message: (props) => `${props.value}手机号不可用`,
      },
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({ information: "2dsphere" });

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
