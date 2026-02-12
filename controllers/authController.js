const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {
  try {
    const { name, idNumber, password, role } = req.body;

    if (!name || !idNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Same ID + Same Role check
    const existingUser = await User.findOne({ idNumber, role });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this role" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      idNumber,
      password: hashedPassword,
      role: role.toLowerCase(),
    });

    return res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: newUser._id,
        name: newUser.name,
        idNumber: newUser.idNumber,
        role: newUser.role,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// ======================
// LOGIN USER
// ======================
const loginUser = async (req, res) => {
  try {
    const { idNumber, password, role } = req.body;

    console.log("QUERY ROLE:", role);

    if (!idNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      idNumber,
      role: role.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful ✅",
      token,
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
