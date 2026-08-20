const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");

// Save FCM token
router.post("/fcm-token", protect, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required"
      });
    }

    const studentId = req.user.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    student.fcmToken = token;

    await student.save();

    res.json({
      success: true,
      message: "FCM token saved successfully"
    });

  } catch (error) {

    console.error("FCM Token Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save FCM token"
    });
  }
});

module.exports = router;
