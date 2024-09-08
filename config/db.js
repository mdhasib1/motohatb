const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
