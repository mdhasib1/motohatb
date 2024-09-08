const mongoose = require('mongoose');

const SellerOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const SellerOtp = mongoose.model('SellerOtp', SellerOtpSchema);

module.exports = SellerOtp;
