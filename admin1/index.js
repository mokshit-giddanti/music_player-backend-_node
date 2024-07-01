const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const adminRoutes = require('./routes/admin');
const musicRoutes = require('./routes/music');
const auth = require('./middleware/auth');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

app.use('/admin', adminRoutes);
app.use('/music', musicRoutes);

app.get('/protected', auth, (req, res) => {
  res.send({ message: "This is a protected route." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
