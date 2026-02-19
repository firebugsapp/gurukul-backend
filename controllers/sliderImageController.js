const SliderImage = require("../models/SliderImage");

// ================= GET SLIDER IMAGES =================
exports.getSliderImages = async (req, res) => {
  try {
    const images = await SliderImage.find({ active: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      images
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch slider images"
    });
  }
};
