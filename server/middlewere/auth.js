const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    console.log(token, "TOKEN");
    // Split "Bearer <token>"
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
    console.log(decoded, "DECODED");
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    req.user = decoded; // attach decoded payload directly
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authenticate;
