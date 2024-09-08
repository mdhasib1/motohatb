const jwt = require('jsonwebtoken');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h'
    }
  );
};

module.exports = { generateOtp, generateToken };
