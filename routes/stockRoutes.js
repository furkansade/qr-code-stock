const express = require('express');
const Stock = require('../models/Stock.js');
const stockController = require('../controllers/stockController.js');

const router = express.Router();

router.route('/').get(stockController.stocksPage);
router.route('/:id').get(stockController.getStockById);
// download QR code
router.route('/download/:id').get(stockController.downloadQRCode);
router.route('/print/:id').get(stockController.printQrCode);

// API routes
router.route('/').post(stockController.createStock);
router.route('/:id').put(stockController.updateStock);
router.route('/:id').delete(stockController.deleteStock);

module.exports = router;
