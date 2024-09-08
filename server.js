const http = require('http');
const app = require('./app');
const initSocketServer = require('./socket/socketServer');
const initChatSocket = require('./socket/chatSocket');
const initNotificationSocket = require('./socket/notificationSocket');

const server = http.createServer(app);
const io = initSocketServer(server);

initChatSocket(io);
initNotificationSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
