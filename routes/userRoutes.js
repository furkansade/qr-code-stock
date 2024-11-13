const express = require('express');
const userController = require('../controllers/userController.js');
const { requireAdmin, requireAuth } = require('../middlewares/checkUser.js');

const router = express.Router();

// Tüm rotalar için giriş yapma zorunluluğu
router.use(requireAuth);

router.route('/').get(userController.usersPage);
router.route('/').post(userController.createUser);
router.route('/:id').delete(requireAdmin, userController.deleteUser);

module.exports = router;
