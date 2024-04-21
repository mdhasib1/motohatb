const Chat = require('../Models/Chat.model');
const User = require('../Models/User.model');

const chatControllers = {
    sendMessageToAdmin: async (req, res, io) => {
    const { message } = req.body;
    let senderId;

    if (req.user) {
      senderId = req.user._id;
    } else {
      senderId = 'guest-user-id';
    }

    try {
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        return res.status(404).json({ message: 'Admin user not found' });
      }
      const newChat = new Chat({
        senderId: senderId,
        receiverId: adminUser._id,
        message: message,
        timestamp: new Date()
      });

      const savedChat = await newChat.save();

      io.sockets.in('admin_room').emit('newMessage', savedChat);


      res.status(200).json({
        success: true,
        message: 'Message sent to admin successfully',
        data: savedChat
      });
    } catch (error) {
      console.error('Error sending message to admin:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while sending message to admin',
        error: error.message
      });
    }
  },

  getMessagesForAdmin: async (req, res) => {
    try {
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        return res.status(404).json({ message: 'Admin user not found' });
      }
      const messages = await Chat.find({ receiverId: adminUser._id })
        .populate('senderId', 'fullName')
        .sort({ timestamp: -1 })
        .exec();

      res.status(200).json({
        success: true,
        messages
      });
    } catch (error) {
      console.error('Error getting messages for admin:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving messages for admin',
        error: error.message
      });
    }
  },

};

module.exports = chatControllers;
