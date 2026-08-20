const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Student = require("../models/Student");

const protect = require("../middleware/authMiddleware");

// =====================================================
// SAVE FCM TOKEN
// =====================================================

router.post("/fcm-token", protect, async (req, res) => {

  try {

    const { token } = req.body;

    if (!token) {

      return res.status(400).json({
        success: false,
        message: "FCM token is required"
      });

    }


    // ==========================================
    // 1. Logged-in User find karo
    // ==========================================

    const user = await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }


    // ==========================================
    // 2. Sirf student ko allow karo
    // ==========================================

    if (user.role !== "student") {

      return res.status(403).json({
        success: false,
        message: "Only students can save FCM token"
      });

    }


    // ==========================================
    // 3. User ke idNumber se Student find karo
    // ==========================================

    const student =
      await Student.findOne({
        studentId: user.idNumber
      });


    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student profile not found for this user"
      });

    }


    // ==========================================
    // 4. FCM Token save karo
    // ==========================================

    student.fcmToken = token;

    await student.save();


    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({

      success: true,

      message: "FCM token saved successfully",

      studentId: student.studentId

    });


  } catch (error) {

    console.error(
      "FCM TOKEN ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to save FCM token",

      error: error.message

    });

  }

});


module.exports = router;
