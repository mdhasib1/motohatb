const asyncHandler = require("express-async-handler");
const User = require("../Models/User.model");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, please login' });
    }

    try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(verified._id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token has expired, please log in again' });
      }

      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ error: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
