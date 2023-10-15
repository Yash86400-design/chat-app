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
connectDB();

// Store the 'io' object in the app settings
app.set('socket', io);

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ socketId }) => {
    socket.join(socketId);
  });

  socket.on('sendMessage', ({ socketId, message, name, senderId }) => {
    const createdAt = new Date();  // Mimicing the database date type
    io.to(socketId).emit('receiveMessage', { message, name, createdAt, senderId });
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
    const allRoomsAndClients = io.sockets.adapter.rooms;
    for (const [key, set] of allRoomsAndClients.entries()) {
      if (set.has(socket.id)) {
        set.delete(socket.id);
      }
    }
  });
});

// Routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(groupChat);
app.use(personalChat);

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

// Start the server
server.listen(port, () => console.log(`Server started at http://localhost:${port}`.blue));

// Error Handler
app.use(errorHandler);