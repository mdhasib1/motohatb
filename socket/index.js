const socketIo = require('socket.io');
const Chat = require('../Models/Chat.model');

module.exports = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Client joined room: ${roomId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { senderId, message, receiverId, temporaryId } = data;
      let roomId;

      if (!senderId) {
        roomId = `guest_${temporaryId}_${receiverId}`;
      } else {
        roomId = `${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
      }

      const chat = new Chat({
        senderId: senderId || temporaryId,
        receiverId,
        message,
        roomId
      });
      await chat.save();
      io.to(roomId).emit('receiveMessage', chat);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
