require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  tokenLife: '1h',
  refreshTokenLife: '7d'
};
