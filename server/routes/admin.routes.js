const express = require('express');
const { Authentication } = require('../middlewares/authmiddle');
const {
  AdminData,
 createAdmin,
 createUser, createHost
} = require('../controllers/admin.controller');

const isSuperAdmin = require('../middlewares/superAdmin');
const router = express.Router();


router.get('/admin-data', Authentication, AdminData);
router.post('/add-admin',isSuperAdmin,createAdmin)
router.post('/add-user',isSuperAdmin,createUser)
router.post('/add-host',isSuperAdmin,createHost)


module.exports = router;
