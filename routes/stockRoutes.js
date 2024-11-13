const express = require('express');
const stockController = require('../controllers/stockController.js');
const { requireAuth, requireAdmin } = require('../middlewares/checkUser.js');

const router = express.Router();

// Tüm rotalar için giriş yapma zorunluluğu
router.use(requireAuth);

// Tüm kullanıcılar erişebilir
router.get('/', stockController.stocksPage);
router.get('/:id', stockController.getStockById);
router.get('/download/:id', stockController.downloadQRCode);
router.get('/print/:id', stockController.printQrCode);

// Sadece admin kullanıcılar erişebilir
router.post('/', requireAdmin, stockController.createStock);
router.put('/:id', requireAdmin, stockController.updateStock);
router.delete('/:id', requireAdmin, stockController.deleteStock);

module.exports = router;