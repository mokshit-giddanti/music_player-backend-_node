const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const auth = require('../middleware/auth');

router.get('/',  async (req, res) => {
  try {
    const music = await Music.find();
    res.json(music);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error ' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).send({ message: 'Error ' });
    }
    res.json(music);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error ' });
  }
});

module.exports = router;
