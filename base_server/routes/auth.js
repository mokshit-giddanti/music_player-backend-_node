const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MusicCustomer = require('../models/MusicCustomer');
const auth = require('../middleware/auth'); // Assuming you have middleware for authentication

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Validator utilities
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
  return re.test(password);
};

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await MusicCustomer.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: `${email} is already registered` });
    }
    if (!validatePassword(password)) {
      return res.status(400).send({ message: "Password must be at least 8 characters long and contain at least one uppercase letter and one special character." });
    }
    if (!validateEmail(email)) {
      return res.status(400).send({ message: "Invalid email format." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new MusicCustomer({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.send({ message: "Registration successful!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "An error occurred while registering the user." });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await MusicCustomer.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: "Login successful!", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "An error occurred while logging in." });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.send({ message: "Logout successful!" });
});

// Check authentication route
// Check authentication route
router.get('/check', auth, async (req, res) => {
  try {
      // Assuming req.user contains the decoded user information from JWT
      const user = await MusicCustomer.findById(req.user.id);
      if (!user) {
          return res.status(404).send({ message: 'User not found' });
      }
      res.json({ name: user.name }); // Send user information
  } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: 'Server error' });
  }
});


module.exports = router;
