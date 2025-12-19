const authenticate = require("./auth");
const UserModel = require("../models/userModel");

const authorizeAdmin = [
  authenticate,
  async (req, res, next) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Always verify from DB so older tokens (without role) still work.
      const user = await UserModel.findById(userId).select("role");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
];

module.exports = authorizeAdmin;
