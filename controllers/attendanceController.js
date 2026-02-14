const Attendance = require("../models/Attendance");

// ======================
// MARK / UPDATE ATTENDANCE (SAFE)
// ======================
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date) {
      return res.status(400).json({
        message: "studentId and date are required",
      });
    }

    // 🔍 check if attendance already exists
    const existing = await Attendance.findOne({ studentId, date });

    if (existing) {
      // UPDATE
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
// GET ATTENDANCE BY DATE
// ======================
const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendanceList = await Attendance.find({ date })
      .populate("studentId", "name className section rollNumber")
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

    const records = await Attendance.find({ studentId }).sort({ date: -1 });

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
  getAttendanceByDate,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
  monthlyReport,
};
