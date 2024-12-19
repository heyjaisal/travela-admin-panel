const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Admin = require("../models/adminModel");
const User = require("../models/usermodel");
require("dotenv").config();

exports.createSuperAdmin = async (req, res) => {
  const { name, email, password, role, position } = req.body;
  console.log(name);

  try {
    const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      return res.status(403).send("A Super Admin already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newSuperAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || "superadmin",
      position: position || "Chief Manager",
    });

    await newSuperAdmin.save();
    res.status(201).send("Super Admin created successfully.");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    res.status(500).send("Internal server error.");
  }
};

exports.loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("hello user")
    const user = await Admin.findOne({
      email,
      $or: [{ role: "superadmin" }, { role: "admin" }],
    });

    if (!user) {
      return res.status(404).json({ error: "Super Admin not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const dashboard = user.role === "superadmin" ? "home" : "all-users";

    res.status(200).json({
      message: `${user.role}logged in successfully.`,
      token,
      dashboard,
    });
  } catch (error) {
    console.error("Error during Super Admin login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, position, personalEmail, mobile } =
      req.body;

    console.log(name, email, password, role, position, personalEmail, mobile);

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { personalEmail }, { mobile }, { position }],
    });

    if (existingAdmin) {
      const duplicateField =
        existingAdmin.email === email
          ? "Email"
          : existingAdmin.personalEmail === personalEmail
          ? "Personal email"
          : existingAdmin.mobile === mobile
          ? "Mobile number"
          : "Position";
      console.log("ee", existingAdmin);

      return res.status(400).json({
        success: false,
        error: `${duplicateField} is already in use.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      position,
      personalEmail,
      mobile,
    });
    await newAdmin.save();

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER, // Your Gmail email
        pass: process.env.SMTP_PASS, // Your Gmail app password
      },
      tls: {
        rejectUnauthorized: false, // Disable SSL certificate validation
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: personalEmail,
      subject: "Your Admin Dashboard Login Details",
      text: `Hello ${name},

Your admin account has been successfully created. Here are your login details:

Email: ${email}
Password: ${password}

Please log in to the admin dashboard and change your password immediately for security purposes.

Best regards,
The Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Admin created successfully. Login details sent via email.",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.Getadmin = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" });
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.Getuser = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.Gethost = async (req, res) => {
  try {
    const users = await User.find({ role: "host" });
    res.json(users);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.verifyAdmin = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  // console.log("Received Token:", token);
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Decode the token
    console.log('hello pranav')
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user using the ID from the token and ensure the role is "superadmin"
    const user = await Admin.findOne({ _id: decoded.id, role: "superadmin" });
    console.log("User Found:", user);

    if (!user) {
      return res.status(401).json({ message: "Superadmin not found" });
    }

    // Send the role in the response
    res.status(200).json({ role: user.role });

  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

