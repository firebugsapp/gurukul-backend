const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    joiningDate: {
      type: String,
      default: "",
    },

    salary: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
