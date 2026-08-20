const Notice = require("../models/Notice");

const getStudentNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      notices: notices.map((notice) => ({
        _id: notice._id,
        title: notice.title,
        description: notice.description,
        active: notice.active,
        createdAt: notice.createdAt || notice._id.getTimestamp(),
        updatedAt: notice.updatedAt || notice._id.getTimestamp()
      }))
    });

  } catch (error) {
    console.error("Get notices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notices"
    });
  }
};

module.exports = {
  getStudentNotices
};
