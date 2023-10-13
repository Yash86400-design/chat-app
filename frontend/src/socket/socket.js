import socketIOClient from 'socket.io-client';

const createSocketInstance = (token) => {
  const serverURL = process.env.SOCKET_SERVER_URL || 'http://localhost:5000';

  const socket = socketIOClient(serverURL, {
    query: { token }
  });

  return socket;
};

export default createSocketInstance;
