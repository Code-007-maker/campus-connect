const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify token and attach user
const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Role checker middleware (this was missing)
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    if (req.user.role !== role)
      return res.status(403).json({ message: "Forbidden: Role required" });

    next();
  };
};

module.exports = { authMiddleware, requireRole };
