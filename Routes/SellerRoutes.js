const express = require('express');
const sellerController = require('../Controllers/Seller.controllers');
const {  authenticateToken,
    authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

const userRoutes = (io) => {
    router.post('/seller/register', (req, res) => sellerController.register(req, res, io));
    router.post('/seller/login', (req, res) => sellerController.login(req, res, io));
    router.post('/seller/verify-otp', (req, res) => sellerController.verifyOtp(req, res, io));
    router.post('/seller/resend-otp', (req, res) => sellerController.resendOtp(req, res, io));
    router.get('/seller/:sellerId', (req, res) => sellerController.getUser(req, res, io));
    router.get('/sellers', (req, res) => sellerController.getUsers(req, res, io));
    router.put('/seller/changepassword', authenticateToken, (req, res) => sellerController.changePassword(req, res, io));
    router.put('/seller/updateprofile/:sellerId', authenticateToken, (req, res) => sellerController.updateProfile(req, res, io));
    router.post('/seller/resetpassword', (req, res) => sellerController.sendPasswordResetEmail(req, res));
    router.get('/seller_businessname', (req, res) => sellerController.getStores(req, res));

    return router;
};

module.exports = userRoutes;