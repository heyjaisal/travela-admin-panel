const express = require('express');
const { superAdmin, loginAdmin, createAdmin, createUser, createHost, restrictUser } = require('../controllers/auth.controller');
const isSuperAdmin = require('../middlewares/superAdmin');
const router = express.Router();

router.post('/signup',superAdmin);
router.post('/login',loginAdmin);
router.post('/add-admin',isSuperAdmin,createAdmin)
router.post('/add-user',isSuperAdmin,createUser)
router.post('/add-host',isSuperAdmin,createHost)
router.put('/change-restrict/:id',isSuperAdmin,restrictUser)

module.exports = router;
