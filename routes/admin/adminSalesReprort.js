
const express = require('express');
const router = express.Router();
const sales = require('../../controllers/admin/adminSalesReport')


router.get('/' , sales.showSalesReportPage );

router.post('/getMonthlySales' , sales.monthlySalse);

router.post('/getDailySales' ,sales.dailySalse);

router.post('/getEarlySales' ,sales.getEarlySalse);

router.post('/betweenRange' , sales.betweenRange);

module.exports = router;