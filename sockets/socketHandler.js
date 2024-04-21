module.exports = (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  };
  