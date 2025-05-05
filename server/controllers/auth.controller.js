const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const User = require("../models/user");
const Host = require("../models/host");
require("dotenv").config();

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    if (admin.isRestricted)
      return res
        .status(403)
        .json({ message: "Your account is restricted from logging in." });

       
        

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: admin._id, role: admin.role, allowedPages: admin.allowedPages },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        allowedPages: admin.allowedPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    console.log(error);
  }
};


exports.restrictUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    let Model;
    if (type === "host") {
      Model = Host;
    } else if (type === "user") {
      Model = User;
    } else if (type === "admin") {
      Model = Admin;
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isNowRestricted = user.status !== "Restricted";

    user.status = isNowRestricted ? "Restricted" : "active";
    if ("isRestricted" in user) {
      user.isRestricted = isNowRestricted;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error toggling user restriction:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, age, mobile, position, allowedPages } = req.body;
  try {
    if (
      !name ||
      !email ||
      !role ||
      !age ||
      !mobile ||
      !position ||
      !allowedPages
    ) {
      return res.status(403).json({ message: "all feilds are required" });
    }
    const admin = await Admin.findById(id);

    if (!admin) {
      res.status(403).json({ message: "No admin found" });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.age = age || admin.age;
    admin.mobile = mobile || admin.mobile;
    admin.position = position || admin.position;
    admin.allowedPages = allowedPages || admin.allowedPages;

    admin.save();

    res.status(200).json({ message: "Admin updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to updated Admin", error });
  }
};

exports.logout = async (req, res) => {

  try {
    res.cookie("token", "", { maxAge: 1, secure: true, sameSite: "None" });

    return res.status(200).json("Logout Succesfull");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server Error");
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Admin.findById(userId).select(
      "email _id username image name age mobile position role country street city firstName lastName"
    );

    if (!user) return res.status(404).send("USER NOT FOUND");

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.saveAdmin = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const { username, country, street, city, gender ,firstName,lastName} = req.body;
  
    const user = await Admin.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.username = username || user.username;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.country = country || user.country;
    user.street = street || user.street;
    user.city = city || user.city;
    user.gender = gender || user.gender;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

exports.superAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      age,
      mobile,
      position,
      role,
      isSuperAdmin,
      allowedPages,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      name,
      age,
      mobile,
      position,
      role,
      isSuperAdmin,
      allowedPages: allowedPages || [
        "home",
        "notifications",
        "profile",
        "messages",
        "payments",
        "all-users",
        "requests",
        "approval",
        "create",
      ],
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Super admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};