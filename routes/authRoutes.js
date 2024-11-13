const express = require('express');
const authController = require('../controllers/authController.js');
const { checkUser } = require('../middlewares/checkUser.js');

const router = express.Router();

// Giriş sayfası, kullanıcı bilgilerini kontrol eder
router.get('/', checkUser, authController.loginPage);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
