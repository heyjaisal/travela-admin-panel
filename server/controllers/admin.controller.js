const Admin = require("../models/admin");
const Host = require("../models/host");
const User = require("../models/user");

exports.AdminData = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    res.json({ user: { 
      id: admin._id, 
      name: admin.name, 
      email: admin.email, 
      image :admin.image,
      role: admin.role, 
      allowedPages: admin.allowedPages
    } });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Server error",error });
  }
};

exports.Getadmin = async (req, res) => {
  try {
    const admins = await Admin.find({ isSuperAdmin: false },"_id name age position email mobile status allowedPages role firstName lastName");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

exports.Getusers = async (req, res) => {
  try {
    const users = await User.find({}, '_id username image country email gender followers status'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error',error  });
  }
};

exports.Gethosts = async (req, res) => {
  try {
    const hosts = await Host.find({}, "_id username email image country age phone gender status").lean();

    res.status(200).json(hosts);
  } catch (error) {
    console.error('Error fetching hosts:', error);
    res.status(500).json({ message: 'Internal server error',error  });
  }
}

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
      role: role ,
      position: position 
    });

    await newSuperAdmin.save();
    res.status(201).send("Super Admin created successfully.");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    res.status(500).send({message: "Internal server error",error });
  }
};