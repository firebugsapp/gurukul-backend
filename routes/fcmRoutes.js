const express = require("express");
const router = express.Router();

const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const admin = require("../config/firebase");

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

// ==========================================
// SEND TEST NOTIFICATION
// ==========================================

router.post("/send-notification", verifyToken, async (req, res) => {

    try {

        const { title, body, fcmToken } = req.body;

        if (!fcmToken) {

            return res.status(400).json({
                success: false,
                message: "FCM token is required"
            });

        }

        if (!title || !body) {

            return res.status(400).json({
                success: false,
                message: "Title and body are required"
            });

        }

        const message = {

            token: fcmToken,

            notification: {
                title: title,
                body: body
            },

            data: {
                type: "test",
                title: title,
                body: body
            }

        };

        const response =
            await admin
                .messaging()
                .send(message);

        console.log(
            "Notification sent successfully:",
            response
        );

        return res.status(200).json({

            success: true,

            message:
                "Notification sent successfully",

            messageId:
                response

        });

    } catch (error) {

        console.error(
            "SEND NOTIFICATION ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to send notification",

            error:
                error.message

        });

    }

});

module.exports = router;
