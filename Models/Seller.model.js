const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  earnings: {
    type: Number,
    default: 0
  },
  stores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
