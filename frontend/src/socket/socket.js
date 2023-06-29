// import socketIOClient from 'socket.io-client';

// const socket = socketIOClient('http://localhost:5000');

// export default socket;


import socketIOClient from 'socket.io-client';

const createSocketInstance = (token) => {
  const socket = socketIOClient('http://localhost:5000', {
    query: { token }
  });
  return socket;
};

export default createSocketInstance;

