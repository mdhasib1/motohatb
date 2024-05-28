const express = require('express');
const router = express.Router();
const {
  createCharge,
  getChargeById,
  updateCharge,
  deleteCharge,
  getAllCharges,
  getAllwithoutcatCharges
} = require('../Controllers/chargeController');

router.post('/charges', createCharge);
router.get('/charges/:id', getChargeById);
router.put('/charges/:id', updateCharge);
router.delete('/charges/category/:id', deleteCharge);
router.get('/charges/subcategory/:id', getAllCharges); 
router.get('/all/charges', getAllwithoutcatCharges);

module.exports = router;
