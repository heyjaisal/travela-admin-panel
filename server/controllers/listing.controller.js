const Admin = require("../models/admin");
const Host = require("../models/host");
const Property = require("../models/property");
const Events = require('../models/event');
const Blog = require("../models/blog");
const Review = require("../models/Review");
const User = require("../models/user");

exports.getReviews = async (req, res) => {
  try {
    const { itemType, item } = req.params;

    if (!["Event", "Property"].includes(itemType)) {
      return res.status(400).json({ error: "Invalid itemType" });
    }

    const reviews = await Review.find({ itemType, item }).populate({
      path: "user",
      select: "username image",
    });

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
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