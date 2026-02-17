const Attendance = require("../models/Attendance");

// ======================
// MARK / UPDATE ATTENDANCE (SAFE)
// ======================
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, className } = req.body;

    if (!studentId || !date || !className) {
      return res.status(400).json({
        message: "studentId, date and className are required",
      });
    }

    // 🔍 SAME student + date + class
    const existing = await Attendance.findOne({
      studentId,
      date,
      className,
    });

    if (existing) {
      existing.status = status || existing.status;
      existing.markedBy = req.user.id;

      await existing.save();

      return res.status(200).json({
        message: "Attendance updated successfully ✅",
        attendance: existing,
      });
    }

    // CREATE NEW
    const attendance = await Attendance.create({
      studentId,
      date,
      status: status || "Present",
      className, // 🔥 IMPORTANT
      markedBy: req.user.id,
    });

    return res.status(201).json({
      message: "Attendance marked successfully ✅",
      attendance,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Attendance marking failed ❌",
      error: error.message,
    });
  }
};

// ======================
// GET ATTENDANCE BY DATE + CLASS
// ======================
const getAttendanceByDateAndClass = async (req, res) => {
  try {
    const { date, className } = req.query;

    if (!date || !className) {
      return res.status(400).json({
        message: "date and className required",
      });
    }

    const attendanceList = await Attendance.find({
      date,
      className,
    })
      .populate("studentId", "name rollNumber fatherName")
      .populate("markedBy", "name role");

    return res.status(200).json({
      message: "Attendance list fetched ✅",
      total: attendanceList.length,
      attendance: attendanceList,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// GET ATTENDANCE BY STUDENT
// ======================
const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({ studentId })
      .sort({ date: -1 });

    return res.status(200).json({
      message: "Student attendance fetched ✅",
      total: records.length,
      attendance: records,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE ATTENDANCE (by id)
// ======================
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found ❌" });
    }

    return res.status(200).json({
      message: "Attendance updated successfully ✅",
      attendance: updatedAttendance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE ATTENDANCE
// ======================
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found ❌" });
    }

    return res.status(200).json({
      message: "Attendance deleted successfully ✅",
      deletedAttendance: deleted,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================
// MONTHLY REPORT
// ======================
const monthlyReport = async (req, res) => {
  try {
    const { studentId, month, year } = req.params;

    if (!studentId || !month || !year) {
      return res.status(400).json({
        message: "studentId, month and year required",
      });
    }

    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const records = await Attendance.find({
      studentId,
      date: { $gte: startDate, $lte: endDate },
    });

    const presentCount = records.filter(r => r.status === "Present").length;
    const absentCount = records.filter(r => r.status === "Absent").length;
    const total = records.length;

    const percentage =
      total === 0 ? 0 : ((presentCount / total) * 100).toFixed(2);

    return res.status(200).json({
      message: "Monthly attendance report fetched ✅",
      studentId,
      month,
      year,
      totalDays: total,
      presentDays: presentCount,
      absentDays: absentCount,
      attendancePercentage: percentage + "%",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByDateAndClass,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
  monthlyReport,
};
