const initNotificationSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('subscribeToNotifications', (userId) => {
            socket.join(`notifications_${userId}`);
        });

        const notifyUser = (userId, notification) => {
            io.to(`notifications_${userId}`).emit('receiveNotification', notification);
        };
    });
};

module.exports = initNotificationSocket;
