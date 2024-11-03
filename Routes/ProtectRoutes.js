const express = require('express');
const router = express.Router();
const productController = require('../Controllers/Protect.Controllers');
const {  authenticateToken,
    authorizeAdmin } = require("../middlewares/authMiddleware");

router.get('/protect/products', authenticateToken, productController.getAllProducts); 

module.exports = router;
