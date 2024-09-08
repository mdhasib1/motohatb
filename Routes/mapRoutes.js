const express = require('express');
const router = express.Router();
const mapController = require('../Controllers/mapController');

router.get('/nearestProducts', mapController.getNearestProducts);

module.exports = router;