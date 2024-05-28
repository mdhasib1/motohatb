const Chat = require('../Models/Chat.model');
const User = require('../Models/User.model');

const createChatMessage = async (req, res) => {
  console.log(req.body)
  const { senderId, message, receiverId, phone } = req.body;
  try {
    let sender = await User.findById(senderId);
    let roomId;

    if (!sender) {
      roomId = `guest_${phone}_${receiverId}`;
      sender = { _id: phone };
    } else {
      roomId = `${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
    }

    console.log(roomId)

    const chat = new Chat({
      senderId: sender._id,
      receiverId,
      message,
      temporaryId: sender._id === phone ? phone : undefined,
      roomId
    });

    await chat.save();
    res.status(201).send(chat);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getChats = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const roomId = `${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
    const chats = await Chat.find({ roomId }).sort({ timestamp: 1 });
    res.status(200).send(chats);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAdminId = async (req,res) => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      res.status(200).send(admin._id);
    } else {
      throw new Error('Admin not found');
    }
  } catch (error) {
    throw new Error(`Error getting admin ID: ${error.message}`);
  }
};

module.exports = {
  createChatMessage,
  getChats,
  getAdminId
};
