const express = require('express');
const { getBookingStats, monthlyPayment  } = require('../controllers/graphs.controller');

const router = express.Router();

router.get('/line-graph', getBookingStats)
router.get('/monthly-payments', monthlyPayment)

module.exports = router;
