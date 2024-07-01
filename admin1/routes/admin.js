const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword } = require('../utils/validators');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: `${email} is already an admin` });
    }
    if (!validatePassword(password)) {
      return res.status(400).send({ message: "Password must be at least 8 characters long and contain at least one uppercase letter and one special character." });
    }
    if (!validateEmail(email)) {
      return res.status(400).send({ message: "Invalid email format." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send({ message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred while registering the user." });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: "Login successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred while logging in." });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.send({ message: "Logout successful!" });
});

module.exports = router;
