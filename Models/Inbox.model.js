const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unreadCount: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

const Inbox = mongoose.model('Inbox', inboxSchema);
module.exports = Inbox;
