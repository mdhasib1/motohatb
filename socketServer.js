const socketIO = require('socket.io');

const initSocketServer = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

module.exports = initSocketServer;
