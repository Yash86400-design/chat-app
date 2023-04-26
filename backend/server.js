const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
// const db = require('./db');
const connectDB = require('./db');

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Cookie Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

// Connect to database
connectDB();

app.listen(port, () => console.log(`Server started on port ${port}`))
// console.log('hellow world');