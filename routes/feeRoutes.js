const express = require("express");
const router = express.Router();

const {
  payFee,
  getAllFees,
  getFeesByStudent,
  deleteFee,
} = require("../controllers/feeController");

const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/pay", authMiddleware, payFee);
router.get("/", authMiddleware, getAllFees);
router.get("/student/:studentId", authMiddleware, getFeesByStudent);
router.delete("/:id", authMiddleware, deleteFee);

module.exports = router;