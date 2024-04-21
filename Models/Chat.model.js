const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

chatSchema.pre('save', function(next) {
  if (!this.isModified('senderId')) return next();
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
