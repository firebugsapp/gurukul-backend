const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
    type: String,
    unique: true
  },
    name: {
      type: String,
      required: true
    },
    fatherName: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    rollNumber: {
      type: Number,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
