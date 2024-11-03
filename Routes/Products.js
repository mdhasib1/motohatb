const express = require("express");
const router = express.Router();
const productController = require("../Controllers/Product.controllers");
const { authenticateToken, authorizeAdmin } = require("../middlewares/authMiddleware");

// Routes for products
router.post("/products", authenticateToken, productController.createProduct);
router.get("/products/:id", productController.getProductById);
router.get("/products", productController.getAllProducts);  // For public products
router.get("/seller/products", authenticateToken, productController.getAllProductsbyUser); // Seller-specific route
router.put("/products/:id", authenticateToken, productController.updateProduct);
router.delete("/products/:id", authenticateToken, authorizeAdmin, productController.deleteProduct);

// Additional product-related routes
router.get("/related/:productId", productController.getRelatedProducts);
router.get("/popular", productController.getPopularProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/featured", productController.getFeaturedProducts);
router.get("/most-affordable", productController.getMostAffordableProducts);
router.get("/most-premium", productController.getMostPremiumProducts);

module.exports = router;
