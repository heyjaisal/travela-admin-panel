const express = require("express");
const { Authentication } = require("../middlewares/authmiddle");
const {
  Getadmin,
  Gethosts,
  Getusers,
  getListings,
  getUserBlogs,
  getReviews,
} = require("../controllers/listing.controller");

const router = express.Router();

router.get("/all-admins", Authentication, Getadmin);
router.get("/all-users", Authentication, Getusers);
router.get("/all-hosts", Authentication, Gethosts);
router.get("/:id/blogs", Authentication, getUserBlogs);
router.get("/reviews/:itemType/:item", getReviews);
router.get("/:id/listings", Authentication, getListings);

module.exports = router;
