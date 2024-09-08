const express = require('express');
const locationController = require('../Controllers/locationController');

const router = express.Router();

router.get('/bangladesh/divisions', locationController.getDivisions);
router.get('/districts', locationController.getDistricts);
router.get('/upazilas', locationController.getUpazilas);

module.exports = router;
