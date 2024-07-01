const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const auth = require('../middleware/auth');

// Get all music entries
router.get('/', auth, async (req, res) => {
  try {
    const music = await Music.find();
    res.json(music);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error retrieving music entries' });
  }
});

// Get a single music entry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).send({ message: 'Music entry not found' });
    }
    res.json(music);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error retrieving music entry' });
  }
});

// Add a new music entry
router.post('/', auth, async (req, res) => {
  const { name,image, link } = req.body;
  try {
    const newMusic = new Music({ name,image, link });
    await newMusic.save();
    res.status(201).json(newMusic); // Return the entire new music object
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding music entry' });
  }
});

// Update a music entry by ID
router.put('/:id', auth, async (req, res) => {
  const { name,image,link } = req.body;
  try {
    const music = await Music.findByIdAndUpdate(
      req.params.id,
      { name,image,link },
      { new: true, runValidators: true }
    );
    if (!music) {
      return res.status(404).send({ message: 'Music entry not found' });
    }
    res.json(music); // Return the updated music object
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating music entry' });
  }
});

// Delete a music entry by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const music = await Music.findByIdAndDelete(req.params.id);
    if (!music) {
      return res.status(404).send({ message: 'Music entry not found' });
    }
    res.json({ id: req.params.id, message: 'Music entry deleted' }); // Return the deleted music entry ID
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting music entry' });
  }
});

module.exports = router;
