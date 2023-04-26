const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: "Hi There, Welcome To My Server" });
});

app.listen(port, () => console.log(`Server started on port ${port}`))
// console.log('hellow world');