const express = require('express');
const router = express.Router();
const storeController = require('../Controllers/Stores.Controllers');
const { authenticateToken } = require("../middlewares/authMiddleware");

module.exports = (io) => {
  router.get('/motohat/stores', (req, res) => storeController.getAllStores(req, res, io));
  router.get('/stores/my-stores', authenticateToken, (req, res) => storeController.getMyStores(req, res, io));
  router.get('/stores/:id', (req, res) => storeController.getStoreById(req, res, io));
  router.delete('/stores/:storeId', authenticateToken, (req, res) => storeController.deleteStore(req, res, io));
  router.post('/stores/:id/follow', authenticateToken, (req, res) => storeController.followStore(req, res, io));

  return router;
};
