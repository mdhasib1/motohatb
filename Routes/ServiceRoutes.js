const express = require('express');
const router = express.Router();
const serviceController = require('../Controllers/Service.controllers');

router.post('/services', serviceController.createService);
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);
router.put('/services/:id', serviceController.updateServiceById);
router.delete('/services/:id', serviceController.deleteServiceById);

module.exports = router;
