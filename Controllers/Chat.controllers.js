const Chat = require('../Models/Chat.model');
const Inbox = require('../Models/Inbox.model');
const Message = require('../Models/Message.model');
const mongoose = require('mongoose');

const createChat = async (req, res) => {
  console.log('createChat:', req.body);
  try {
    const { senderId, receiverId, message } = req.body;

    // Validate the request body
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if chat exists between users
    let chat = await Chat.findOne({ users: { $all: [senderId, receiverId] } });
    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = new Chat({ users: [senderId, receiverId] });
      await chat.save();
    }

    // Create a new message
    const newMessage = new Message({
      chatId: chat._id,
      sender: senderId,
      content: message,
      timestamp: new Date()
    });
    await newMessage.save();

    // Respond with the chat and new message
    res.status(200).json({ chat, message: newMessage });
  } catch (error) {
    console.log("Error in createChat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get chat by ID
const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate('messages');
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    const message = await Message.create({ chat: chatId, sender: senderId, content });
    
    // Update chat with last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: Date.now() });

    // Emit the message to the socket
    req.io.emit('receiveMessage', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start a guest chat
const startGuestChat = async (req, res) => {
  try {
    const { phone, name, storeId } = req.body;
    const guestUser = await GuestUser.create({ phone, name });
    const chat = await createChat({ userIds: [guestUser._id], storeId });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer guest chats to a registered user
const transferGuestChats = async (req, res) => {
  try {
    const { guestUserId, registeredUserId } = req.body;
    await Chat.updateMany({ 'users': guestUserId }, { $addToSet: { users: registeredUserId } });
    res.status(200).json({ message: 'Chats transferred successfully' });
  } catch (error) {
    console.log('Error transferring guest chats:', error)
    res.status(500).json({ error: error.message });
  }
};

// Get user's inbox
const getInbox = async (req, res) => {
  try {
    const inbox = await Inbox.find({ user: req.params.userId }).populate('chat lastMessage');
    res.status(200).json(inbox);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  getChat,
  sendMessage,
  startGuestChat,
  transferGuestChats,
  getInbox,
};
