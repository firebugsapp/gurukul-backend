const Notice = require("../models/Notice");
const User = require("../models/User");
const admin = require("../config/firebase");

// =====================================================
// GET STUDENT NOTICES
// =====================================================

const getStudentNotices = async (req, res) => {
  try {

    const notices = await Notice.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      notices: notices.map((notice) => ({
        _id: notice._id,
        title: notice.title,
        description: notice.description,
        active: notice.active,
        createdAt: notice.createdAt || notice._id.getTimestamp(),
        updatedAt: notice.updatedAt || notice._id.getTimestamp()
      }))
    });

  } catch (error) {

    console.error("Get notices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notices"
    });
  }
};


// =====================================================
// CREATE NOTICE + SEND FCM NOTIFICATION
// =====================================================

const createNotice = async (req, res) => {

  try {

    const { title, description } = req.body;


    // ================= VALIDATION =================

    if (!title || !description) {

      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });

    }


    // ================= SAVE NOTICE =================

    const notice = await Notice.create({

      title: title.trim(),

      description: description.trim(),

      active: true

    });


    console.log(
      "Notice created:",
      notice._id
    );


    // =================================================
    // GET ALL STUDENT FCM TOKENS
    // =================================================

    const students = await User.find({

      role: "student",

      fcmToken: {
        $exists: true,
        $ne: ""
      }

    }).select("fcmToken");


    const tokens = students

      .map(student => student.fcmToken)

      .filter(token => token);


    console.log(
      "Student FCM tokens:",
      tokens.length
    );


    // =================================================
    // SEND NOTIFICATION
    // =================================================

    if (tokens.length > 0) {

      const message = {

        notification: {

          title: title.trim(),

          body: description.trim()

        },

        tokens: tokens

      };


      const response =
        await admin
          .messaging()
          .sendEachForMulticast(message);


      console.log(
        "FCM notification result:",
        response.successCount,
        "success,",
        response.failureCount,
        "failed"
      );

    } else {

      console.log(
        "No student FCM tokens found"
      );

    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message: "Notice created successfully",

      notice: {

        _id: notice._id,

        title: notice.title,

        description: notice.description,

        active: notice.active,

        createdAt: notice.createdAt,

        updatedAt: notice.updatedAt

      }

    });


  } catch (error) {

    console.error(
      "Create notice error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to create notice",

      error: error.message

    });

  }

};


module.exports = {

  getStudentNotices,

  createNotice

};
