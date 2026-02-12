const Fee = require("../models/Fee");
const Student = require("../models/Student");

// ======================
// PAY FEE (ADD PAYMENT)
// ======================
const payFee = async (req, res) => {
  try {
    const { studentId, month, year, amountPaid, paymentMode, paidDate } = req.body;

    if (!studentId || !month || !year || !amountPaid) {
      return res.status(400).json({ message: "studentId, month, year, amountPaid required ❌" });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    // Receipt Number Generate
    const receiptNumber = "REC-" + Date.now();

    const fee = await Fee.create({
      studentId,
      className: student.className,
      month,
      year,
      amountPaid,
      paymentMode: paymentMode || "Cash",
      paidDate: paidDate || new Date().toISOString().split("T")[0],
      receiptNumber,
      paidBy: req.user.id,
    });

    return res.status(201).json({
      message: "Fee paid successfully ✅",
      fee,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ALL FEES
// ======================
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("studentId", "name rollNumber className section")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All fees fetched successfully ✅",
      total: fees.length,
      fees,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET FEES BY STUDENT
// ======================
const getFeesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const fees = await Fee.find({ studentId })
      .populate("studentId", "name rollNumber className section")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Student fee history fetched successfully ✅",
      total: fees.length,
      fees,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE FEE RECORD
// ======================
const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFee = await Fee.findByIdAndDelete(id);

    if (!deletedFee) {
      return res.status(404).json({ message: "Fee record not found ❌" });
    }

    return res.status(200).json({
      message: "Fee record deleted successfully ✅",
      deletedFee,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  payFee,
  getAllFees,
  getFeesByStudent,
  deleteFee,
};