const express = require('express');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const router = express.Router();


router.post('/:id', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const sender = req.user.userId;

  try {
    const receiverId = req.params.id;
    console.log('Welcome in the user room');
  } catch (error) {

  }
});


module.exports = router;