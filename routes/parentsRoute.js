const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");

// GET all parents
router.get("/", verifyToken, async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" }).select("-password");
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST add parent
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const parent = await User.create({ name, email, password: hashed, role: "parent" });
    res.status(201).json({ message: "Parent added ✅", parent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
