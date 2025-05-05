const express = require('express');

const { Authentication } = require('../middlewares/authmiddle');
const { userDetails, getBlogById, detailList, deleteImage, uploadImage } = require('../controllers/users.controller');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/:id', Authentication, userDetails);
router.get('/blog/:id', getBlogById);
router.get('/details/:id',detailList);
router.post('/upload', Authentication, upload.single('image'), uploadImage);
router.delete('/delete', Authentication, deleteImage);

module.exports = router;
