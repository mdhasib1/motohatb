const mongoose = require('mongoose');

const guestUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
}, { timestamps: true });

const GuestUser = mongoose.model('GuestUser', guestUserSchema);
module.exports = GuestUser;
