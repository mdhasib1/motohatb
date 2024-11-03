const express = require('express');
const userController = require('../Controllers/User.controllers');
const { authenticateToken, authorizeAdmin, refreshToken } = require("../middlewares/authMiddleware");

const router = express.Router();

const userRoutes = (io) => {
    router.post('/auth/register', (req, res) => userController.register(req, res, io));
    router.post('/auth/login', (req, res) => userController.login(req, res, io));
    router.post('/auth/verify-otp', (req, res) => userController.verifyOtp(req, res, io));
    router.post('/auth/resend-otp', (req, res) => userController.resendOtp(req, res, io));
    router.get('/user/:userId', authenticateToken, (req, res) => userController.getUser(req, res, io));
    router.get('/users', authenticateToken, authorizeAdmin, (req, res) => userController.getUsers(req, res, io));
    router.put('/changepassword', authenticateToken, (req, res) => userController.changePassword(req, res, io));
    router.put('/updateprofile/:userId', authenticateToken, (req, res) => userController.updateProfile(req, res, io));
    router.post('/auth/resetpassword', (req, res) => userController.sendPasswordResetEmail(req, res));
    router.put('/auth/resetpassword/:resetToken', (req, res) => userController.resetPassword(req, res));
    router.get("/otp-expiration/:userId", (req, res) => userController.getOtpExpirationTime(req,res,io));

    // Add refresh token route
    router.post('/auth/refresh-token', refreshToken);

    return router;
};

module.exports = userRoutes;
