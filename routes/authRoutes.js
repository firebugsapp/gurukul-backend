const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================
// SIGNUP (Register)
// ======================
router.post("/signup", async (req, res) => {
  const { name, idNumber, password, role } = req.body;

  try {
    // 1️⃣ Required fields check
    if (!name || !idNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check existing user
    const existing = await User.findOne({ idNumber });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      idNumber,
      password: hashed,
      role: role || "student"
    });

    res.status(201).json({
      message: "Signup successful ✅",
      user: {
        id: user._id,
        name: user.name,
        idNumber: user.idNumber,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  const { idNumber, password, role } = req.body;

  try {

    // 1️⃣ Required fields check
    if (!idNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Find user with role check
    const user = await User.findOne({
      idNumber,
      role: role.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        idNumber: user.idNumber,
        role: user.role
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
