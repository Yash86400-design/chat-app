const socketio = require('socket.io');

function startWebSocketServer(server) {
  const io = socketio(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = {
  startWebSocketServer
};
