const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    // token format: Bearer xxxxxx
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing ❌" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token ❌" });
  }
};

module.exports = protect;
