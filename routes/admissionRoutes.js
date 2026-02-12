const express = require("express");
const router = express.Router();

const {
  addAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  approveAdmission,
} = require("../controllers/admissionController");

const authMiddleware = require("../middleware/authMiddleware");

// ======================
// ROUTES
// ======================

// Add Admission
router.post("/add", authMiddleware, addAdmission);

// Get All Admissions
router.get("/", authMiddleware, getAllAdmissions);

// Get Single Admission by ID
router.get("/:id", authMiddleware, getAdmissionById);

// Update Admission
router.put("/:id", authMiddleware, updateAdmission);

// Delete Admission
router.delete("/:id", authMiddleware, deleteAdmission);

// APPROVE ADMISSION (MOVE TO STUDENTS)
router.post("/approve/:id", authMiddleware, approveAdmission);


module.exports = router;
