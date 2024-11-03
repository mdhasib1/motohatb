const express = require('express');
const affiliateController = require('../Controllers/Affiliate.controllers');
const { authenticateToken, authorizeAdmin, refreshToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Affiliate routes
router.post('/affiliate/register', (req, res) => affiliateController.register(req, res));
router.post('/affiliate/login', (req, res) => affiliateController.login(req, res));
router.post('/affiliate/bank-details', authenticateToken, (req, res) => affiliateController.addBankDetails(req, res));
router.post('/affiliate/generate-link', authenticateToken, (req, res) => affiliateController.generateReferralLink(req, res));

// New route to track referral link usage
router.post('/affiliate/track-referral', (req, res) => affiliateController.trackReferral(req, res));

module.exports = router;
