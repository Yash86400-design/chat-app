const socketio = require('socket.io');

function startWebSocketServer(server) {
  const io = socketio(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`A user joined room ${room}`);
    });
    socket.on('leave', (room) => {
      socket.leave(room);
      console.log(`A user left room ${room}`);
    });
    socket.on('message', (message) => {
      console.log(`Received message: ${message}`);
    });
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = {
  startWebSocketServer
};