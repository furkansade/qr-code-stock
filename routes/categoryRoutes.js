const express = require('express');

const Category = require('../models/Category.js');
const categoryController = require('../controllers/categoryController.js');

const router = express.Router();

router.route('/').post(categoryController.createCategory);

module.exports = router;