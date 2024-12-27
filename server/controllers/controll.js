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
      role: role ,
      position: position 
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
    const user = await Admin.findOne({
      email,
      $or: [
        { role: "superadmin" },
        { role: "admin" },
        { role: "marketingadmin" },
        { role: "financeadmin" },
        { role: "useradmin" },
      ],
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
    );

    res.status(200).json({
      message: `${user.role} logged in successfully.`,
      token,
      role: user.role,  
    });
  } catch (error) {
    console.error("Error during Super Admin login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, position, mobile } =
      req.body;

    console.log(name, email, password, role, position, mobile);

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { mobile }, { position }],
    });

    if (existingAdmin) {
      const duplicateField =
        existingAdmin.email === email
          ? "Email"
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
      mobile,
    });
    await newAdmin.save();

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
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

exports.updateAdmin = async (req, res) => {
  const { name, email, password, role, position, personalEmail, mobile } = req.body;
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    // Optionally hash the password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    // Update admin fields
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.position = position || admin.position;
    admin.personalEmail = personalEmail || admin.personalEmail;
    admin.mobile = mobile || admin.mobile;

    await admin.save();
    res.status(200).json({ admin, message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update admin' });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
};
