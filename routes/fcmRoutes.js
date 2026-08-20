const express = require("express");
const router = express.Router();

const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// ==========================================
// SAVE FCM TOKEN
// ==========================================

router.post("/fcm-token", verifyToken, async (req, res) => {

    try {

        const { fcmToken } = req.body;

        if (!fcmToken) {

            return res.status(400).json({
                success: false,
                message: "FCM token is required"
            });

        }

        // JWT se User ID
        const userId = req.user.id;

        console.log("FCM Token User ID:", userId);

        // User find karo
        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // FCM token save
        user.fcmToken = fcmToken;

        await user.save();

        console.log(
            "FCM token saved for:",
            user.idNumber
        );

        return res.status(200).json({
            success: true,
            message: "FCM token saved successfully"
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
