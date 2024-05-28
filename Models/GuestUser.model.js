const mongoose = require('mongoose');

const guestUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  }
});

const GuestUser = mongoose.model('GuestUser', guestUserSchema);

module.exports = GuestUser;
