const express = require('express');
const router = express.Router();
const { createSuperAdmin, loginSuperAdmin, createAdmin, Getadmin, Getuser, Gethost, updateAdmin, deleteAdmin } = require('../controllers/controll');
const  verifyToken = require('../middlewares/authmiddle');
router.post('/signup', createSuperAdmin); 
router.post('/login', loginSuperAdmin); 
router.post('/create-admin',verifyToken,createAdmin)
router.get('/get-admin',Getadmin)
router.get('/get-user',Getuser)
router.get('/get-host',Gethost)
router.put('/update-admin/:id',verifyToken,updateAdmin)
router.delete('/delete-admin/:id',verifyToken,deleteAdmin)

module.exports = router;
