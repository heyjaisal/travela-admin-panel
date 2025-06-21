const express = require('express');

const {
  AdminData,
 createAdmin,
 createUser, createHost,
 updateTestimonial,
 updateFaqItem,
 updateCardItem,
 getHomepageContent,
} = require('../controllers/admin.controller');

const isSuperAdmin = require('../middlewares/superAdmin');
const router = express.Router();

router.post('/add-admin',isSuperAdmin,createAdmin)
router.post('/add-user',isSuperAdmin,createUser)
router.post('/add-host',isSuperAdmin,createHost)
router.get('/homepage', getHomepageContent);
router.put('/homepage/card/:id', updateCardItem);
router.put('/homepage/faq/:id', updateFaqItem);
router.put('/homepage/testimonial/:id', updateTestimonial);

module.exports = router;
