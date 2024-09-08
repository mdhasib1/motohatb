const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 50
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
