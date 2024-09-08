const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
