const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./models/db');

// Import routes
// const authRoutes = require('./controllers/auth'); //before arranging code
const authRoutes = require('./routes/index');

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Cookie Middleware
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
// app.use('/auth', authRoutes);
app.use(authRoutes);  // removed auth cause it's already been prefixed in routes/index.js file...

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

// Connect to database
connectDB();

// app.listen(port, () => console.log(`Server started on port ${port}`))  // Old way
app.listen(port, () => console.log(`Server started at http://localhost:${port}`.bgCyan));