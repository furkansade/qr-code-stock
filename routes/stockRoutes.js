const express = require('express');
const Stock = require('../models/Stock.js');
const stockController = require('../controllers/stockController.js');

const router = express.Router();

router.route('/').get(stockController.stocksPage);
router.route('/').post(stockController.createStock);

module.exports = router;
