const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'MusicCustomer' },
  music: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
