const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const admin = require("./config/firebase");
// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentsRoute = require("./routes/parentsRoute");
const attendanceRoutes = require("./routes/attendanceRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const feeRoutes = require("./routes/feeRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const sliderImageRoutes = require("./routes/sliderImageRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const fcmRoutes = require("./routes/fcmRoutes");



dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/parents", parentsRoute);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api", sliderImageRoutes);
app.use("/api", noticeRoutes);
app.use("/api/student", fcmRoutes);



// Root
app.get("/", (req, res) => {
  res.send("Gurukul School Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
