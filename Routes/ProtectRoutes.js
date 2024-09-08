const express = require('express');
const router = express.Router();
const productController = require('../Controllers/Protect.Controllers');

const {protect, admin} = require("../middlewares/Protect");

router.get('/protect/products', protect, productController.getAllProducts); 

module.exports = router;
