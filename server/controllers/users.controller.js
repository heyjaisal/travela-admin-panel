const User = require("../models/user");
const Blog = require("../models/blog");
const Host = require("../models/host");
const Property = require("../models/property");
const Events = require("../models/event");
const Admin = require("../models/admin");
const cloudinary = require("../config/cloudinary");

exports.userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const isHost = type === "host";
    const Model = isHost ? Host : User;
    const fields = isHost
      ? "image firstName lastName username country email country gender followers"
      : "image firstName lastName username followers country gender email";

    const user = await Model.findById(id).select(fields).lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!isHost) user.followerCount = user.followers.length;

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const blogs = await Blog.find({ author: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("title thumbnail createdAt")
      .populate("author", "username image")
      .lean();

    const totalBlogs = await Blog.countDocuments({ author: id });
    const hasMore = skip + blogs.length < totalBlogs;

    res.json({ blogs, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, page = 1, limit = 10 } = req.query;

    if (!type) {
      return res.status(400).json({ message: "Listing type is required" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const query = { host: id };
    let listings = [];
    let totalListings = 0;

    if (type === "property") {
      totalListings = await Property.countDocuments(query);
      listings = await Property.find(query)
        .sort({ createdAt: -1 })
        .select("propertyType images price country city")
        .skip(skip)
        .limit(Number(limit))
        .lean();
    } else if (type === "event") {
      totalListings = await Events.countDocuments(query);
      listings = await Events.find(query)
        .sort({ createdAt: -1 })
        .select("title images eventVenue country ticketPrice city")
        .skip(skip)
        .limit(Number(limit))
        .lean();
    } else {
      return res.status(400).json({ message: "Invalid listing type" });
    }

    const hasMore = skip + listings.length < totalListings;
    res.json({ listings, hasMore, type });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folderMap = {
      profile: "profile-images",
    };

    const folder = folderMap[req.body.type] || "default-images";

    const uploadToCloudinary = (fileBuffer, folder) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const { secure_url: imageUrl, public_id } = await uploadToCloudinary(req.file.buffer, folder);

    if (req.body.type === "profile") {
      await Admin.findByIdAndUpdate(req.user.id, { image: imageUrl }, { new: true });
    }
  
    

    res.status(200).json({ imageUrl, public_id, type: req.body.type });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteImage = async (req, res) => {
  try {
    const { image, type } = req.body;
    

    if (!image || !type)
      return res.status(400).json({ message: "No image or type provided" });

    const models = { profile: Admin,};
    const model = models[type];
    if (!model) return res.status(400).json({ message: "Invalid type" });

    const record = await model.findById(req.userId);
    const publicId = image.split("/").pop().split(".")[0];
    const folder = `${type}-images`;

    if (record?.image === image) {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      await model.findByIdAndUpdate(req.userId, { image: null }, { new: true });
      return res
        .status(200)
        .json({ message: "Image deleted from both database and Cloudinary" });
    }

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    return res.status(200).json({ message: "Image deleted from Cloudinary" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error" });
  }
};