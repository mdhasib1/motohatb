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
  temporaryId: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  roomId: {
    type: String,
    required: true
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
