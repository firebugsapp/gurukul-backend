const Teacher = require("../models/Teacher");

// ======================
// ADD TEACHER
// ======================
const addTeacher = async (req, res) => {
  try {
    const { name, email, mobile, subject, qualification, address, joiningDate, salary } = req.body;

    if (!name || !mobile || !subject) {
      return res.status(400).json({ message: "Name, mobile and subject are required" });
    }

    // Email duplicate check
    if (email) {
      const existing = await Teacher.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Teacher with this email already exists ❌" });
      }
    }

    const teacher = await Teacher.create({
      name,
      email,
      mobile,
      subject,
      qualification,
      address,
      joiningDate,
      salary,
    });

    return res.status(201).json({
      message: "Teacher added successfully ✅",
      teacher,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ALL TEACHERS
// ======================
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All teachers fetched successfully ✅",
      total: teachers.length,
      teachers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET SINGLE TEACHER
// ======================
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found ❌" });
    }

    return res.status(200).json({
      message: "Teacher fetched successfully ✅",
      teacher,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE TEACHER
// ======================
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found ❌" });
    }

    return res.status(200).json({
      message: "Teacher updated successfully ✅",
      teacher: updatedTeacher,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE TEACHER
// ======================
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found ❌" });
    }

    return res.status(200).json({
      message: "Teacher deleted successfully ✅",
      deletedTeacher,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
