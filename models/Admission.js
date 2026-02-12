const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    admissionNumber: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    className: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      default: "",
    },

    studentCreated: {
      type: Boolean,
      default: false,
    },


    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    address: {
      type: String,
      default: "",
    },

    previousSchool: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      
    },

    admissionDate: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);
