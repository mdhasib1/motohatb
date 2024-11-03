const express = require('express');
const { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon } = require('../Controllers/couponController');
const {  authenticateToken,
    authorizeAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/coupons',  createCoupon);
router.get('/coupons',  getCoupons);
router.get('/coupons/:id', authenticateToken, authorizeAdmin, getCoupon);
router.put('/coupons/:id', authenticateToken, authorizeAdmin, updateCoupon);
router.delete('/coupons/:id', authenticateToken, authorizeAdmin, deleteCoupon);

module.exports = router;
