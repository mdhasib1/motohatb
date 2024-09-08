const chatService = require('../services/chatService');
const inboxService = require('../services/inboxService');

const createChat = async (req, res) => {
  try {
    const { userId1, userId2, storeId } = req.body;
    const chat = await chatService.createChat([userId1, userId2], storeId);
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await chatService.getChat(req.params.chatId);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = await chatService.sendMessage(req.body.chatId, req.body.senderId, req.body.content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const startGuestChat = async (req, res) => {
  try {
    const { phone, name, storeId } = req.body;
    const guestUser = await chatService.findOrCreateGuestUser(phone, name);
    const chat = await chatService.createChat([guestUser._id], storeId);
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const transferGuestChats = async (req, res) => {
  try {
    const { guestUserId, registeredUserId } = req.body;
    await chatService.transferGuestChats(guestUserId, registeredUserId);
    res.status(200).json({ message: 'Chats transferred successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInbox = async (req, res) => {
  try {
    const inbox = await inboxService.getUserInbox(req.params.userId);
    res.status(200).json(inbox);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createChat, getChat, sendMessage, startGuestChat, transferGuestChats, getInbox };
