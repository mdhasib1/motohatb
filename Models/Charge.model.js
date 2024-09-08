const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chargeSchema = new Schema({
  platformCharge: {
    type: Number,
    required: true
  },
  additionalCharge: {
    type: Number,
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Charge = mongoose.model('Charge', chargeSchema);
module.exports = { Charge };
