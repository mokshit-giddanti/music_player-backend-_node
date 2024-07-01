const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const musicRoutes = require('./routes/music');
const playlistRoutes = require('./routes/playlists');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 8001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

app.use('/music', musicRoutes);
app.use('/playlists', playlistRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
