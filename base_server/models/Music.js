const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  name: String,
  image: String,
  link: String,
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;
