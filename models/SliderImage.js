const mongoose = require("mongoose");

const sliderImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SliderImage", sliderImageSchema);
