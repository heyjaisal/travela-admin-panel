const express = require("express");

const { Authentication } = require("../middlewares/authmiddle");
const { userDetails, getUserBlogs, getListings } = require("../controllers/users.controller");

const router = express.Router();

router.get("/:id", Authentication, userDetails);
router.get("/:id/blogs", Authentication, getUserBlogs);
router.get("/:id/listings",Authentication, getListings);

module.exports = router;
