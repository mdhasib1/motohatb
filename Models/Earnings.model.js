const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  earnings: {
    type: Number,
    default: 0
  },
  commissionHistory: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        amount: { type: Number, default: 0 },
        isPositive: { type: Boolean, default: true }
      }
    ],
    default: []
  },
  bonusHistory: {
    type: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, default: 0 }
      }
    ],
    default: []
  }
});

const Earnings = mongoose.model('Earnings', earningsSchema);

module.exports = Earnings;
