const express = require('express');
const router = express.Router();
const productController = require('../Controllers/Product.controllers');
const {protect,admin} = require("../middlewares/Protect");

router.post('/product',protect, productController.createProduct);
router.put('/products/:id', productController.updateProduct); 
router.get('/products/:id', productController.getProductById); 
router.delete('/products/:id', productController.deleteProduct); 
router.get('/products', productController.getAllProducts); 
router.get('/related/:productId', productController.getRelatedProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/featured', productController.getFeaturedProducts);
router.get('/most-affordable', productController.getMostAffordableProducts);
router.get('/most-premium', productController.getMostPremiumProducts);
module.exports = router;
