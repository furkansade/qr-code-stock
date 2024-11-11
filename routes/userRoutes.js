const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/').get(userController.usersPage);
router.route('/').post(userController.createUser);
router.route('/:id').delete(userController.deleteUser);

module.exports = router;
