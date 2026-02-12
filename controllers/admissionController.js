const Admission = require("../models/Admission");

// ======================
// GENERATE ADMISSION NUMBER
// ======================
const generateAdmissionNumber = async () => {
  const total = await Admission.countDocuments();
  const newNumber = total + 1;

  return "ADM" + String(newNumber).padStart(4, "0"); 
  // ADM0001, ADM0002...
};

// ======================
// ADD NEW ADMISSION
// ======================
const addAdmission = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      dob,
      gender,
      className,
      section,
      mobile,
      aadhaarNumber,
      address,
      previousSchool,
      admissionDate,
    } = req.body;

    if (!name || !fatherName || !className || !mobile) {
      return res.status(400).json({
        message: "Name, Father Name, Class and Mobile are required ❌",
      });
    }

    // Aadhaar duplicate check
    if (aadhaarNumber) {
      const existingAadhaar = await Admission.findOne({ aadhaarNumber });
      if (existingAadhaar) {
        return res.status(400).json({
          message: "Aadhaar already exists ❌",
        });
      }
    }

    const admissionNumber = await generateAdmissionNumber();

    const admission = await Admission.create({
      admissionNumber,
      name,
      fatherName,
      motherName,
      dob,
      gender,
      className,
      section,
      mobile,
      aadhaarNumber,
      address,
      previousSchool,
      admissionDate,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Admission created successfully ✅",
      admission,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ALL ADMISSIONS
// ======================
const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All admissions fetched successfully ✅",
      total: admissions.length,
      admissions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ADMISSION BY ID
// ======================
const getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({ message: "Admission not found ❌" });
    }

    return res.status(200).json({
      message: "Admission fetched successfully ✅",
      admission,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE ADMISSION
// ======================
const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAdmission = await Admission.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAdmission) {
      return res.status(404).json({ message: "Admission not found ❌" });
    }

    return res.status(200).json({
      message: "Admission updated successfully ✅",
      admission: updatedAdmission,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE ADMISSION
// ======================
const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmission = await Admission.findByIdAndDelete(id);

    if (!deletedAdmission) {
      return res.status(404).json({ message: "Admission not found ❌" });
    }

    return res.status(200).json({
      message: "Admission deleted successfully ✅",
      deletedAdmission,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const Student = require("../models/Student");
// ======================
// APPROVE ADMISSION (MOVE TO STUDENTS)
// ======================
const approveAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id);
    const totalStudents = await Student.countDocuments();
    const newRollNumber = totalStudents + 1;

    if (!admission) {
      return res.status(404).json({ message: "Admission not found ❌" });
    }

    // Already approved check
    if (admission.status === "Approved") {
      return res.status(400).json({ message: "Admission already approved ❌" });
    }

    // Create student in Students collection
    const newStudent = await Student.create({
      name: admission.name,
      fatherName: admission.fatherName,
      className: admission.className,
      section: admission.section,
      rollNumber: newRollNumber,
      mobile: admission.mobile,
      address: admission.address,
    });

    // Update admission status
    admission.status = "Approved";
    admission.studentCreated = true;
    await admission.save();


    return res.status(200).json({
      message: "Admission approved & student added successfully ✅",
      admission,
      student: newStudent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  approveAdmission,
};
