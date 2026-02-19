const express = require("express");
const router = express.Router();
const {
  getSliderImages
} = require("../controllers/sliderImageController");

const authMiddleware = require("../middleware/auth");

// Student / Public (Token required)
router.get("/slider-images", authMiddleware, getSliderImages);

module.exports = router;
