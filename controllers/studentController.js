const Student = require("../models/Student");
const Counter = require("../models/Counter");

// ======================
// ADD STUDENT
// ======================
const addStudent = async (req, res) => {
  try {
    const { name, fatherName, className, section, rollNumber, mobile, address } = req.body;

    if (!name || !fatherName || !className || !section || !rollNumber || !mobile || !address) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // 🔥 AUTO GENERATE 5 DIGIT STUDENT ID (GKL00001)
    const counter = await Counter.findOneAndUpdate(
      { name: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formattedStudentId =
      "GKL" + String(counter.seq).padStart(5, "0");

    const newStudent = await Student.create({
      studentId: formattedStudentId,   // ✅ NEW FIELD
      name,
      fatherName,
      className,
      section,
      rollNumber,
      mobile,
      address
    });

    return res.status(201).json({
      message: "Student added successfully ✅",
      student: newStudent
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ALL STUDENTS
// ======================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Students fetched successfully ✅",
      total: students.length,
      students
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET STUDENT BY ID
// ======================
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    return res.status(200).json({
      message: "Student fetched successfully ✅",
      student
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE STUDENT
// ======================
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    return res.status(200).json({
      message: "Student updated successfully ✅",
      student
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE STUDENT
// ======================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    return res.status(200).json({
      message: "Student deleted successfully ✅",
      student
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET STUDENTS BY CLASS
// ======================
const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;

    const students = await Student.find({ className })
      .sort({ rollNumber: 1 });

    return res.status(200).json({
      message: "Students fetched class wise ✅",
      total: students.length,
      students
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET CLASS WITH STUDENT COUNT
// ======================
const getClassWithStudentCount = async (req, res) => {
  try {

    const result = await Student.aggregate([
      {
        $group: {
          _id: "$className",
          studentCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return res.status(200).json({
      message: "Class list with student count ✅",
      classes: result
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =====================================================
// GET LOGGED-IN STUDENT PROFILE
// =====================================================

const getMyStudentProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!user.idNumber) {
      return res.status(404).json({
        success: false,
        message: "Student ID number not found in login account"
      });
    }

    const student = await Student.findOne({
      idNumber: user.idNumber
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      student
    });

  } catch (error) {
    console.error("Get my student profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profile"
    });
  }
};

// ======================
// EXPORTS
// ======================
module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
  getClassWithStudentCount,
  getMyStudentProfile
};
