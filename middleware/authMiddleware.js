// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assumes "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    req.userId = decoded.id; // Attach user ID to request object
    next();
  });
};

module.exports = authMiddleware;