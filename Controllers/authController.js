const passport = require('passport');
const { generateToken } = require('../utils/token');

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication error', error: err });
        }

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        try {
            const token = generateToken(user);
            return res.redirect(`https://motohat.com/api/google/callback?token=${token}`);
        } catch (error) {
            return res.status(500).json({ message: 'Token generation error', error });
        }
    })(req, res, next);
};

exports.facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', { session: false }, async (err, user) => {
        if (err) {
            console.error('Facebook authentication error:', err);
            return res.status(500).json({ message: 'Authentication error', error: err });
        }

        if (!user) {
            console.log('Facebook authentication failed, no user');
            return res.status(401).json({ message: 'Authentication failed' });
        }

        try {
            const token = generateToken(user);
            console.log('Facebook authentication successful, redirecting with token:', token);
            return res.redirect(`https://motohat.com/api/google/callback?token=${token}`);
        } catch (error) {
            console.error('Token generation error:', error);
            return res.status(500).json({ message: 'Token generation error', error });
        }
    })(req, res, next);
};
