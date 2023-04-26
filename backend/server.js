const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./db');

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Cookie Middleware
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

// Connect to database
connectDB();

// app.listen(port, () => console.log(`Server started on port ${port}`))  // Old way
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));