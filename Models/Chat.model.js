const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
