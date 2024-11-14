const express = require('express');
const stockController = require('../controllers/stockController.js');
const { requireAdmin } = require('../middlewares/checkUser.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Tüm rotalar için giriş yapma zorunluluğu
router.use(authMiddleware.authenticateToken);

// Tüm kullanıcılar erişebilir
router.get('/', stockController.stocksPage);
router.get('/:id', stockController.getStockById);
router.get('/download/:id', stockController.downloadQRCode);
router.get('/print/:id', stockController.printQrCode);

// Sadece admin kullanıcılar erişebilir
router.post('/', stockController.createStock);
router.put('/:id', stockController.updateStock);
router.delete('/:id', stockController.deleteStock);

module.exports = router;