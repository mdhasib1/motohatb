// authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleCallback, facebookCallback } = require('../controllers/authController');

router.get('/google',passport.authenticate('google', { scope:
        [ 'email', 'profile' ]
}));
router.get('/google/callback', googleCallback);

// Facebook OAuth Routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', facebookCallback);

module.exports = router;
