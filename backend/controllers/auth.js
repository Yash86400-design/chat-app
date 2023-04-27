const express = require('express');
const router = express.Router();

// Login route
router.post('/login', async(req, res) => {
  /* 
    // Old way to do this, but after cookie things changed
    const { email, password } = req.body;
    // authenticate user credentials
    if (email === 'example@gmail.com' && password === 'password') {
      // set a cookie to remember the user's login status
      res.cookie('loggedIn', true);
      // redirect user to home page
      res.redirect('/home.html');
    } else {
      // redirect to login page with error message
      res.redirect('/login.html?error=authentication');
    }
  */
  const user = await getUserFromDatabase(req.body.email, req.body.password);

  if (user) {
    // Set a cookie with the user's authentication token
    res.cookie('authToken', user.authToken);

    // Redirect to the home page
    res.redirect('/home');
  } else {
    // Handle invalid login credentials
    res.status(401).json({ error: 'Invalid login credentials' });
  }

});

// Logout route
router.post('/logout', (req, res) => {
  // clear authenticated cookie
  res.clearCookie('authenticated');

  // redirect to login page
  res.redirect('/login/html');
});

// Signup route
router.post('/signup', (req, res) => {
  const { email, password, username } = req.body;

  // perform signup logic here
  // redirect to login page with success message
  res.redirect('/login.html?success=signup');
});


// Reading the cookie and redirecting to home
router.get('/home', (req, res) => {
  const authToken = req.cookies.authToken;

  if (authToken) {
    // User is authenticated, show the home page
    res.render('home');
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
});

// Get all the users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;