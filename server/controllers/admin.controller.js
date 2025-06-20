const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Admin = require("../models/admin");
const User = require("../models/user");
const Host = require("../models/host");
const Content = require("../models/Content");
require("dotenv").config();

function updateFixedArray(existingArray, updates, requiredLength, sectionName) {
  if (!Array.isArray(updates) || updates.length !== requiredLength) {
    throw new Error(`${sectionName} must have exactly ${requiredLength} items`);
  }

  return existingArray.map((item, index) => {
    return { ...item.toObject(), ...updates[index] };
  });
}

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

exports.getHomepageContent = async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCardItem = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, image, span, route, blur } = req.body;

  if (!title || !subtitle || !image || !span || !route || blur === undefined) {
    return res.status(400).json({ message: 'All card fields are required.' });
  }

  try {
    const content = await Content.findOne();
    const cardIndex = content.cardItems.findIndex(card => card._id.toString() === id);

    if (cardIndex === -1) return res.status(404).json({ message: 'Card not found.' });

    content.cardItems[cardIndex] = { ...content.cardItems[cardIndex]._doc, title, subtitle, image, span, route, blur };

    await content.save();
    res.json({ message: 'Card updated successfully.', card: content.cardItems[cardIndex] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateFaqItem = async (req, res) => {
  const { id } = req.params;
  const { question, answer, isActive } = req.body;

  if (!question || !answer || isActive === undefined) {
    return res.status(400).json({ message: 'All FAQ fields are required.' });
  }

  try {
    const content = await Content.findOne();
    const faqIndex = content.faqList.findIndex(faq => faq._id.toString() === id);

    if (faqIndex === -1) return res.status(404).json({ message: 'FAQ not found.' });

    content.faqList[faqIndex] = { ...content.faqList[faqIndex]._doc, question, answer, isActive };

    await content.save();
    res.json({ message: 'FAQ updated successfully.', faq: content.faqList[faqIndex] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { fullName, picture, designation, description } = req.body;

  if (!fullName || !picture || !designation || !description) {
    return res.status(400).json({ message: 'All testimonial fields are required.' });
  }

  try {
    const content = await Content.findOne();
    const testimonialIndex = content.testimonialList.findIndex(t => t._id.toString() === id);

    if (testimonialIndex === -1) return res.status(404).json({ message: 'Testimonial not found.' });

    content.testimonialList[testimonialIndex] = {
      ...content.testimonialList[testimonialIndex]._doc,
      author: { fullName, picture, designation },
      description
    };

    await content.save();
    res.json({ message: 'Testimonial updated successfully.', testimonial: content.testimonialList[testimonialIndex] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
