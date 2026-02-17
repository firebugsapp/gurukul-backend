const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendanceByDateAndClass,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
  monthlyReport
} = require("../controllers/attendanceController");

 
const protect = require("../middleware/authMiddleware");

// MARK ATTENDANCE
router.post("/mark", protect, markAttendance);

// GET ATTENDANCE BY DATE + CLASS
router.get("/by-date-class", protect, getAttendanceByDateAndClass);

// GET ATTENDANCE BY STUDENT
router.get("/student/:studentId", protect, getAttendanceByStudent);

// UPDATE ATTENDANCE
router.put("/update/:id", protect, updateAttendance);

// DELETE ATTENDANCE
router.delete("/delete/:id", protect, deleteAttendance);

// MONTHLY REPORT
router.get("/report/:studentId/:month/:year", protect, monthlyReport);


module.exports = router;
