const express = require('express');
const { Authentication } = require('../middlewares/authmiddle');
const { Getadmin,AdminData, Gethosts, Getusers } = require('../controllers/admin.controller');

const router = express.Router();


router.get('/admin-data',Authentication,AdminData)
router.get('/all-admins',Authentication,Getadmin)
router.get('/all-users',Authentication,Getusers)
router.get('/all-hosts',Authentication,Gethosts)

module.exports = router;