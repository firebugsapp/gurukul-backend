const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Unauthorized, token missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id + role
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

module.exports = { verifyToken };
