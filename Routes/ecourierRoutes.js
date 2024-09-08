const express = require('express');
const router = express.Router();
const ecourier = require('../Controllers/ecourierController');

router.post('/cities', ecourier.getCity);
router.post('/thana-list', ecourier.getThanaList);
router.post('/area-list', ecourier.getAreaList);
router.post('/branch-list', ecourier.getBranchList);
router.post('/packages', ecourier.getPackages);
router.post('/order-place-reseller', ecourier.placeOrderReseller);
router.post('/track', ecourier.parcelTracking);
router.post('/cancel-order', ecourier.cancelOrder);
router.post('/payment-status', ecourier.paymentStatus);

module.exports = router;
