const express = require("express");
const router = express.Router();

const {
  addTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const protect = require("../middleware/authMiddleware");

// Add Teacher
router.post("/add", protect, addTeacher);

// Get All Teachers
router.get("/", protect, getAllTeachers);

// Get Single Teacher
router.get("/:id", protect, getTeacherById);

// Update Teacher
router.put("/update/:id", protect, updateTeacher);

// Delete Teacher
router.delete("/delete/:id", protect, deleteTeacher);

module.exports = router;
