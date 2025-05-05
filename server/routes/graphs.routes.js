const express = require('express');
const { getBookingStats, monthlyPayment ,gethostBookingStats,hostMonthlyPayment } = require('../controllers/graphs.controller');

const router = express.Router();

router.get('/line-graph', getBookingStats)
router.get('/monthly-payments', monthlyPayment)
router.get('/line-graph/:id', gethostBookingStats)
router.get('/monthly-payments/:id', hostMonthlyPayment)
module.exports = router;
