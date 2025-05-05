const express = require('express');
const { superAdmin, loginAdmin, restrictUser, updateAdmin, logout, getAdmin, saveAdmin } = require('../controllers/auth.controller');
const isSuperAdmin = require('../middlewares/superAdmin');
const { Authentication } = require('../middlewares/authmiddle');
const router = express.Router();

router.post('/signup',superAdmin);
router.post('/login',loginAdmin);
router.get('/logout',Authentication,logout)
router.get('/profile',Authentication, getAdmin)
router.put('/profile',Authentication,saveAdmin )
router.put('/change-restrict/:id',isSuperAdmin,restrictUser)
router.put('/update-admin/:id',isSuperAdmin,updateAdmin)

module.exports = router;
