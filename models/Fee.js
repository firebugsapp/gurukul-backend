const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    month: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    },

    paidDate: {
      type: String,
      default: "",
    },

    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
