const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET_KEY || "arpit";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    // Supports both "Bearer <token>" and raw token.
    const token = String(authHeader).includes(" ")
      ? String(authHeader).split(" ")[1]
      : String(authHeader);

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    req.user = decoded; // attach decoded payload directly
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authenticate;
