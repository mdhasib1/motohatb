const Inbox = require('../Models/Inbox.model');

const getUserInbox = async (userId) => {
    return Inbox.find({ user: userId }).populate('chat').populate('lastMessage').sort({ updatedAt: -1 });
};

module.exports = { getUserInbox };
