const express = require("express");
const dotenv = require("dotenv").config();
const colors = require('colors');
const port = process.env.PORT || 5000;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./models/db');
const http = require('http');
const socketIO = require('socket.io');

// Import routes
// const authRoutes = require('./controllers/auth'); //before arranging code
const { authRoutes, profileRoutes, groupChat, personalChat } = require('./routes/index');
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELTE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Logging middleware
app.use(morgan('dev'));

// Cookie Middleware
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to database
// connectDB(app, io);
connectDB();

// Store the 'io' object in the app settings
app.set('socket', io);

/*
const connectedClients = [];
const userRooms = {};  // Object to store room information for each socket

io.on('connection', (socket) => {
  console.log('A user has connected');
  connectedClients.push(socket);

  socket.emit('welcome', 'Welcome to the chatroom!');

  // socket.on('personalMessage', (data) => {
  //   console.log('Received data:', data);
  // });

  // socket.on('userMessage', (msg) => {
  //   socket.emit('receiveMessage', msg);
  // });

  socket.on('joinRoom', (roomName) => {
    if (userRooms[socket.id] && userRooms[socket.id].includes(roomName)) {
      console.log(`Socket ${socket.id} has already joined room ${roomName}`);
      return;
    }

    socket.join(roomName);

    if (!userRooms[socket.id]) {
      userRooms[socket.id] = [roomName];
    } else {
      userRooms[socket.id].push(roomName);
    }

    console.log(`Socket ${socket.id} joined room ${roomName}`);
    // socket.join(roomName);
    // console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  socket.on('sendMessage', ({ targetSocketId, message }) => {
    // if (userRooms[socket.id] && userRooms[socket.id].includes(targetSocketId)) {
    //   io.to(targetSocketId).emit('receiveMessage', message);
    // } else {
    //   console.log(`Socket ${socket.id} is not in room ${targetSocketId}`);
    // }
    // console.log(message);
    io.to(targetSocketId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (userRooms[socket.id]) {
      delete userRooms[socket.id];
    }
  });
});
*/

// Object to store connected clients by ID
// const connectedClients = {};

// io.on('connection', (socket) => {
//   // Join with multiple IDs
//   socket.on('joinWithIds', (id) => {
//     // ids.forEach((id) => {
//     // Store the socket ID in the connectedClients object for the given ID
//     if (!connectedClients[id]) {
//       connectedClients[id] = [];
//     }
//     const alreadyJoined = connectedClients[id].some((id) => id === socket.id);
//     if (!alreadyJoined) {
//       connectedClients[id].push(socket.id);
//     }
//     console.log(`Socket ${socket.id} joined with ID ${id}`);
//     console.log(connectedClients);
//     // });
//   });

//   // Emit a message to all connected clients with the given ID
//   function emitToClientsWithId(id, eventName, data) {
//     const clients = connectedClients[id] || [];
//     clients.forEach((clientId) => {
//       io.in(clientId).emit(eventName, data);
//     });
//   }

//   // Example usage: Emitting a message to all connected clients with specific IDs
//   socket.on('sendMessage', ({ ids, message }) => {
//     console.log(connectedClients);
//     if (connectedClients[ids]) {
//       connectedClients[ids].forEach((id) => {
//         emitToClientsWithId(id, 'receiveMessage', { id, message });
//       });
//     }
//   });

//   // Remove the socket ID when a client disconnects
//   socket.on('disconnect', () => {
//     // Remove the socket ID from the connectedClients object for all IDs
//     for (const id in connectedClients) {
//       const index = connectedClients[id].indexOf(socket.id);
//       if (index !== -1) {
//         connectedClients[id].splice(index, 1);
//         console.log(`Socket ${socket.id} left with ID ${id}`);
//       }
//     }
//   });

// });

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ socketId }) => {
    // const room = io.sockets.adapter.rooms.get(roomId);
    // const room = socket.rooms[roomId];
    // const room1 = Object.keys(io.sockets.adapter.rooms);
    // const room2 = io.sockets.adapter.rooms.get(roomId);
    // console.log(io.sockets.adapter.rooms, room1, room2);

    /*
    const room = io.sockets.adapter.rooms.has(roomId);
    if (room) {
      const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId));
      const alreadyJoined = socketsInRoom.some((id) => id === socket.id);
      if (!alreadyJoined) {
        socket.join(roomId);
        console.log(room);
      }
    } else if (!room) {
      socket.join(roomId);
    } else {
      console.log('Room not found');
    }
    */
    // console.log(socketId);
    socket.join(socketId);
    // console.log(Array.from(io.sockets.adapter.rooms.get(socketId)));
    // console.log(io.sockets.adapter.rooms);
  });

  socket.on('sendMessage', ({ socketId, message, name, senderId }) => {
    // console.log(io.sockets.adapter.rooms);
    // console.log(socketId, message);
    const createdAt = new Date();  // Mimicing the database date type
    io.to(socketId).emit('receiveMessage', { message, name, createdAt, senderId });
    // console.log(message, name, createdAt, senderId);
  });

  socket.on('deleteSocketOnLogout', () => {
    const allRoomsAndClients = io.sockets.adapter.rooms;
    for (const [key, set] of allRoomsAndClients.entries()) {
      if (set.has(socket.id)) {
        set.delete(socket.id);
      }
    }
  });

  socket.on('disconnect', () => {
    // const allRooms = io.sockets.adapter.rooms
    // const joinedRooms = Object.keys(socket.rooms);
    // console.log(joinedRooms);
    // joinedRooms.forEach((roomName) => {
    //   if (roomName !== socket.id) {
    //     socket.leave(roomName);
    //     console.log(`Socket ${socket.id} left room ${roomName}`);
    //   }
    // });
    const allRoomsAndClients = io.sockets.adapter.rooms;
    for (const [key, set] of allRoomsAndClients.entries()) {
      // console.log(key, set);
      if (set.has(socket.id)) {
        set.delete(socket.id);
      }
    }
    // console.log(allRoomsAndClients);
  });
});



// const socketIoObject = io;
// module.exports.ioObject = socketIoObject;

// Routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(groupChat);
app.use(personalChat);

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

// app.listen(port, () => console.log(`Server started at http://localhost:${port}`.blue));

// Start the server
server.listen(port, () => console.log(`Server started at http://localhost:${port}`.blue));


// Error Handler
app.use(errorHandler);