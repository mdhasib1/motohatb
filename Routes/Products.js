const express = require('express');
const router = express.Router();
const productController = require('../Controllers/Product.controllers');
const {protect,admin} = require("../Middleware/Protect");

router.post('/product',protect, productController.createProduct);
router.put('/products/:id', productController.updateProduct); 
router.get('/products/:id', productController.getProductById); 
router.delete('/products/:id', productController.deleteProduct); 
router.get('/products', productController.getAllProducts); 

module.exports = router;
