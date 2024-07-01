const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const MusicCustomer = require('../models/MusicCustomer');
const auth = require('../middleware/auth');

// Get user's playlists
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate('music');
    res.json(playlists);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create or update a playlist
router.post('/', auth, async (req, res) => {
  const { name, music } = req.body;

  // Ensure music is an array of IDs
  if (!Array.isArray(music)) {
    return res.status(400).json({ msg: 'Music IDs must be provided as an array' });
  }

  try {
    let playlist = await Playlist.findOne({ name, user: req.user.id });

    if (playlist) {
      // Playlist exists, update it
      playlist = await Playlist.findByIdAndUpdate(
        playlist._id,
        { $addToSet: { music: { $each: music } } },
        { new: true }
      ).populate('music');
    } else {
      // Playlist does not exist, create new
      const newPlaylist = new Playlist({
        name,
        user: req.user.id,
        music: music,
      });

      playlist = await newPlaylist.save();

      // Update MusicCustomer with the new playlist ID
      await MusicCustomer.findByIdAndUpdate(req.user.id, { $push: { playlists: playlist._id } });
    }

    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
