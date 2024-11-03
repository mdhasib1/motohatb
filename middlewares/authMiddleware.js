const jwt = require('jsonwebtoken');
const User = require('../Models/User.model');

// Middleware to authenticate access token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expired', needRefresh: true });
        }
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Endpoint to refresh token
const refreshToken = (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json({ error: 'Unauthorized' });

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid refresh token' });

        // Generate a new access token
        const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = {
    authenticateToken,
    refreshToken,
    authorizeAdmin,
};
