const express = require('express');
const router = express.Router();
const {
  createDeliveryCharge,
  getDeliveryChargeById,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  getAllDeliveryCharges
} = require('../Controllers/deliveryChargeController');

router.post('/delivery-charges', createDeliveryCharge);
router.get('/delivery-charges/:id', getDeliveryChargeById);
router.put('/delivery-charges/:id', updateDeliveryCharge);
router.delete('/delivery-charges/:id', deleteDeliveryCharge);
router.get('/delivery-charges', getAllDeliveryCharges);

module.exports = router;
