const express = require('express');
const { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon } = require('../Controllers/couponController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/coupons',  createCoupon);
router.get('/coupons',  getCoupons);
router.get('/coupons/:id', authenticate, authorize(['admin', 'manager']), getCoupon);
router.put('/coupons/:id', authenticate, authorize(['admin']), updateCoupon);
router.delete('/coupons/:id', authenticate, authorize(['admin']), deleteCoupon);

module.exports = router;
