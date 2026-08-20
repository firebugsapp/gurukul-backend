const Notice = require("../models/Notice");

const getStudentNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ active: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error("Get notices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

module.exports = {
  getStudentNotices,
};
