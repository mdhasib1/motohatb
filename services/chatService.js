const Chat = require('../Models/Chat.model');
const Message = require('../Models/Message.model');
const Inbox = require('../Models/Inbox.model');
const GuestUser = require('../Models/GuestUser.model');
const User = require('../Models/User.model');


const createChat = async (userIds, storeId) => {
    const chat = new Chat({ users: userIds, store: storeId });
    await chat.save();

    for (const userId of userIds) {
        const inbox = new Inbox({ user: userId, chat: chat._id });
        await inbox.save();
    }
    return chat;
};

const getChat = async (chatId) => {
    return Chat.findById(chatId).populate('users').populate('messages').populate('store');
};

const sendMessage = async (chatId, senderId, content) => {
    const message = new Message({ chat: chatId, sender: senderId, content });
    await message.save();
    const chat = await Chat.findById(chatId);

    for (const userId of chat.users) {
        const inbox = await Inbox.findOne({ user: userId, chat: chatId });
        if (inbox) {
            inbox.lastMessage = message._id;
            inbox.unreadCount = userId.toString() === senderId.toString() ? 0 : inbox.unreadCount + 1;
            inbox.updatedAt = Date.now();
            await inbox.save();
        }
    }

    chat.messages.push(message._id);
    chat.updatedAt = Date.now();
    await chat.save();

    return message;
};

const findOrCreateGuestUser = async (phone, name) => {
    let guestUser = await GuestUser.findOne({ phone });
    if (!guestUser) {
        guestUser = new GuestUser({ phone, name });
        await guestUser.save();
    }
    return guestUser;
};

const transferGuestChats = async (guestUserId, registeredUserId) => {
    const chats = await Chat.find({ users: guestUserId });
    for (const chat of chats) {
        chat.users = chat.users.map(user => (user.toString() === guestUserId.toString() ? registeredUserId : user));
        await chat.save();

        const inbox = await Inbox.findOne({ user: guestUserId, chat: chat._id });
        if (inbox) {
            inbox.user = registeredUserId;
            await inbox.save();
        }
    }
};

module.exports = { createChat, getChat, sendMessage, findOrCreateGuestUser, transferGuestChats };
