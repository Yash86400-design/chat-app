const express = require('express');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const router = express.Router();


router.post('/', authenticateToken, async (req, res) => {
  console.log(req);
  // const { message } = req.body;
  // const sender = req.user.userId;
  // console.log(`Welcome in the user room ${message} from ${sender}`);

  // try {
  //   const receiverId = req.params.id;
  // } catch (error) {

  // }

  next();
});


module.exports = router;