const User = require("../models/user");
const Blog = require("../models/blog");
const Host = require("../models/host");
const Property = require("../models/property");
const Events = require("../models/event");
const Admin = require("../models/admin");
const Booking = require("../models/booking");
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

    const { secure_url: imageUrl, public_id } = await uploadToCloudinary(
      req.file.buffer,
      folder
    );

    if (req.body.type === "profile") {
      await Admin.findByIdAndUpdate(
        req.user.id,
        { image: imageUrl },
        { new: true }
      );
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

    const models = { profile: Admin };
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


exports.detailList = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  let item;

  try {
    if (type === "event") {
      item = await Events.findById(id)
        .populate(
          "host",
          "username image email firstName lastName profileSetup stripeAccountId"
        )
        .lean();

      item.features = Array.isArray(item.features) ? item.features : [];
      item.images = Array.isArray(item.images) ? item.images : [];
    } else if (type === "property") {
      item = await Property.findById(id)
        .populate(
          "host",
          "username image email firstName lastName stripeAccountId"
        )
        .lean();

      item.features = Array.isArray(item.features) ? item.features : [];
      item.images = Array.isArray(item.images) ? item.images : [];

      const bookings = await Booking.find({
        property: id,
        bookingStatus: "confirmed",
      }).select("checkIn checkOut");

      item.bookedDates = bookings.map(({ checkIn, checkOut }) => ({
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
      }));
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    if (!item) {
      return res.status(404).json({ error: `${type} not found` });
    }

    res.json({ item });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .select("id title thumbnail createdAt content location author")
      .populate("author", "username image");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
