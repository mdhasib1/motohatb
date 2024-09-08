const express = require('express');
const router = express.Router();
const {
  createInstallation,
  getInstallationByProductId,
  updateInstallationByProductId,
  deleteInstallationByProductId,
  getAllProductsWithInstallation
} = require('../Controllers/instalation.controllers');

router.post('/installations', createInstallation);
router.get('/installations/:productId', getInstallationByProductId);
router.put('/installations/:productId', updateInstallationByProductId);
router.delete('/installations/:productId', deleteInstallationByProductId);
router.get('/installations/products/with-installation', getAllProductsWithInstallation);

module.exports = router;
