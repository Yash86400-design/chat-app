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
const { authRoutes, profileRoutes } = require('./routes/index');
const { errorHandler } = require("./middlewares/errorHandler");




const app = express();

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
// app.use('/auth', authRoutes);
app.use(authRoutes);  // removed auth cause it's already been prefixed in routes/index.js file...
app.use(profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

// Error Handler
app.use(errorHandler);


// app.listen(port, () => console.log(`Server started on port ${port}`))  // Old way
app.listen(port, () => console.log(`Server started at http://localhost:${port}`.bgCyan));