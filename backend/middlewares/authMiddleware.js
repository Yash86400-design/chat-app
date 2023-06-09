const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Get the JWT token from the cookie
  // const token = req.cookies.token;  // Will use
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user ID to the request object
    // req.userId = decoded.userId;
    // req.userEmail = decoded.email;
    req.user = decoded;
    // console.log(req.user);

    // Call the next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateToken };