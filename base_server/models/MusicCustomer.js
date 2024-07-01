const mongoose = require('mongoose');

const MusicCustomerSchema = new mongoose.Schema({
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
});

module.exports = mongoose.model('MusicCustomer', MusicCustomerSchema);
