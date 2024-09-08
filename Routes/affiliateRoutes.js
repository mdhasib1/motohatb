const express = require('express');
const affiliateController = require('../Controllers/Affiliate.controllers');
const {protect,admin} = require("../middlewares/Protect");

const router = express.Router();

const userRoutes = (io) => {
    router.post('/affiliate/register', (req, res) => affiliateController.register(req, res, io));
    
    return router;
  };
  module.exports = userRoutes;