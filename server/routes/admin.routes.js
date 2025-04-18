const express = require("express");
const { Authentication } = require("../middlewares/authmiddle");
const {
  Getadmin,
  AdminData,
  Gethosts,
  Getusers,
} = require("../controllers/admin.controller");
const { uploadImage, deleteImage } = require("../controllers/users.controller");
const upload = require("../middlewares/multer");
const router = express.Router();

router.get("/admin-data", Authentication, AdminData);
router.get("/all-admins", Authentication, Getadmin);
router.get("/all-users", Authentication, Getusers);
router.get("/all-hosts", Authentication, Gethosts);
router.post("/upload", Authentication, upload.single("image"), uploadImage);
router.delete("/delete", Authentication, deleteImage);

module.exports = router;
