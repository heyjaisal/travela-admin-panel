const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
require("dotenv").config();

const isSuperAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token ;

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    const admin = await Admin.findById(payload.userId); 

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isSuperAdmin) {
      return res.status(403).json({ message: "Require Super Admin Role!" });
    }

    // If everything is fine, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isSuperAdmin;