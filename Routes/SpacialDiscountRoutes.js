const express = require('express');
const router = express.Router();
const hotProductController = require('../Controllers/SpacialDiscountProductController');
const { authenticateToken, authorizeAdmin } = require("../middlewares/authMiddleware");


router.post('/hotproducts',authenticateToken, authorizeAdmin, hotProductController.addHotProduct);
router.get('/hotproducts', hotProductController.getHotProducts);
router.get('/hotproducts/:id', hotProductController.getHotProductById);
router.put('/hotproducts/:id', authenticateToken, authorizeAdmin, hotProductController.updateHotProduct);
router.delete('/hotproducts/:id', authenticateToken, authorizeAdmin, hotProductController.deleteHotProduct);

module.exports = router;
