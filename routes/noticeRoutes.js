const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getStudentNotices } = require("../controllers/noticeController");

router.get("/student/notices", authMiddleware, getStudentNotices);

module.exports = router;
