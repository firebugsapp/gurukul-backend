const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getStudentNotices,
  createNotice
} = require("../controllers/noticeController");


// =====================================================
// GET STUDENT NOTICES
// =====================================================

router.get(
  "/student/notices",
  authMiddleware,
  getStudentNotices
);


// =====================================================
// CREATE NOTICE + SEND NOTIFICATION
// =====================================================

router.post(
  "/notices",
  authMiddleware,
  createNotice
);


module.exports = router;
