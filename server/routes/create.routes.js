const express = require("express");
const { Authentication } = require("../middlewares/authmiddle");
const router = express.Router();
const upload = require("../middlewares/multer");

router.post("/upload", Authentication, upload.single("image"), uploadImage);
router.delete("/delete", Authentication, deleteImage);

module.exports = router;
