const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Admin = require("../models/admin");
const User = require("../models/user");
const Host = require("../models/host");
require("dotenv").config();

exports.AdminData = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
        role: admin.role,
        allowedPages: admin.allowedPages,
      },
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.createSuperAdmin = async (req, res) => {
  const { name, email, password, role, position } = req.body;

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
      role: role,
      position: position,
    });

    await newSuperAdmin.save();
    res.status(201).send("Super Admin created successfully.");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    res.status(500).send({ message: "Internal server error", error });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, password, email, role, age, mobile, position, allowedPages } =
      req.body;

    if (!name || !password || !email || !role || !age || !allowedPages) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await Admin.findOne({ email });
    const existingMobile = await Admin.findOne({ mobile });

    if (existingMobile) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      password: hashedPassword,
      email,
      role,
      mobile,
      position,
      age,
      allowedPages,
      status: "active",
    });

    await newAdmin.save();

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

      Your admin account has been successfully created. Please log in to the admin dashboard and change your password immediately for security purposes.
      Email:${email}
      password:${password}
      Best regards,
      The cheif administrator`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Admin created successfully!" });
  } catch (error) {
    console.error("Error creating Admin:", error);
    res.status(500).send("Internal server error.");
  }
};

exports.createUser = async (req, res) => {
  const { password, username, email, age, country } = req.body;

  try {
    if (!password || !username || !email || !age || !country) {
      return res.status(403).json({ message: "all feilds are required" });
    }

    const existingEmail = await User.findOne({ email });

    const existingName = await User.findOne({ username });

    if (existingName) {
      return res.status(403).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      age,
      country,
      password: hashedPassword,
    });
    await newUser.save();

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
      subject: "Your TRAVELA app Login Details",
      text: `Hello ${username},

Your TRAVELA account has been successfully created. Please log in to the app.


Emial:${email}
password:${password}
Best regards,
The Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "user created succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("failed creating user", error);
  }
};

exports.createHost = async (req, res) => {
  const { password, username, email, age, country, phone } = req.body;

  try {
    if (!password || !username || !email || !age || !country || !phone) {
      return res.status(403).json({ message: "all feilds are required" });
    }

    const existingEmail = await Host.findOne({ email });

    const existingName = await Host.findOne({ username });

    const existingMobile = await Host.findOne({ phone });

    if (existingName) {
      return res.status(403).json({ message: "Username already exists" });
    }
    if (existingEmail) {
      return res.status(403).json({ message: "Email already exists" });
    }

    if (existingMobile) {
      return res.status(403).json({ message: "Mobile already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Host({
      username,
      email,
      age,
      country,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

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
      subject: "Your TRAVELA app Login Details",
      text: `Hello ${username},

     Your TRAVELA account has been successfully created. Please log in to the app.
     Emial:${email}
     password:${password}
     Best regards,
     The Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "user created succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("failed creating user", error);
  }
};


