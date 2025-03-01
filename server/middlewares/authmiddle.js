const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
require("dotenv").config();

exports.Authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token || (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1]);
    console.log();
    

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    
      
    } catch (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    const admin = await Admin.findById(payload.userId).select("_id name email role allowedPages");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.user = { 
      id: admin._id, 
      name: admin.name, 
      email: admin.email, 
      role: admin.role, 
      allowedPages: admin.allowedPages
    };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
