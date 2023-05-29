const express = require("express");
const dotenv = require("dotenv").config();
const colors = require('colors');
const port = process.env.PORT || 5000;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./models/db');

// Import routes
// const authRoutes = require('./controllers/auth'); //before arranging code
const { authRoutes, profileRoutes, groupChat, personalChat } = require('./routes/index');
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

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

// Routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(groupChat);
app.use(personalChat);

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});


app.listen(port, () => console.log(`Server started at http://localhost:${port}`.blue));

// Error Handler
app.use(errorHandler);
