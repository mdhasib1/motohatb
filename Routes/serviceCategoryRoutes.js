const express = require('express');
const router = express.Router();
const serviceCategoryController = require('../Controllers/serviceCategoryController');

router.post('/service-categories', serviceCategoryController.createServiceCategory);

router.get('/service-categories', serviceCategoryController.getAllServiceCategories);

router.get('/service-categories/:id', serviceCategoryController.getServiceCategoryById);

router.put('/service-categories/:id', serviceCategoryController.updateServiceCategory);

router.delete('/service-categories/:id', serviceCategoryController.deleteServiceCategory);

module.exports = router;
