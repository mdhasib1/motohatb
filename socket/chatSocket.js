const chatService = require('../services/chatService');
const { publishMessage } = require('./redisClient');

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', async ({ chatId, senderId, content }) => {
            const message = await chatService.sendMessage(chatId, senderId, content);
            io.to(chatId).emit('message', message);

            // Publish message to Redis for further processing
            publishMessage(message);

            // Update inbox in real-time
            const chat = await chatService.getChat(chatId);
            for (const user of chat.users) {
                io.to(user._id.toString()).emit('updateInbox', chat);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = setupSocket;
