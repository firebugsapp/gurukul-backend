const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
  getClassWithStudentCount,
  getMyStudentProfile
} = require("../controllers/studentController");

// ======================
// STUDENT ROUTES
// ======================

// Add student
router.post("/add", protect, addStudent);

// Count Student
router.get("/class-count", protect, getClassWithStudentCount);

// Get students by class (IMPORTANT: Above /:id)
router.get("/class/:className", protect, getStudentsByClass);

// Get logged-in student's own profile
router.get("/my-profile", protect, getMyStudentProfile);

// Get all students
router.get("/", protect, getAllStudents);

// Get single student
router.get("/:id", protect, getStudentById);

// Update student
router.put("/:id", protect, updateStudent);

// Delete student
router.delete("/:id", protect, deleteStudent);

module.exports = router;
