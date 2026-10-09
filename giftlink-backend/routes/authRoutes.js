const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res, next) => {
try {
const db = await connectToDatabase();
const collection = db.collection('users');

const { firstName, lastName, email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({ message: 'Email and password are required' });
}

const existingUser = await collection.findOne({ email: email });

if (existingUser) {
  return res.status(409).json({ message: 'User already exists' });
}

const hashedPassword = await bcrypt.hash(password, 10);

const result = await collection.insertOne({
  firstName,
  lastName,
  email,
  password: hashedPassword
});

const token = jwt.sign(
  { userId: result.insertedId, email: email },
  process.env.JWT_SECRET || 'giftlink-secret-key',
  { expiresIn: '1d' }
);

return res.status(201).json({
  message: 'Registration successful',
  token: token
});

} catch (error) {
next(error);
}
});

// Login an existing user
router.post('/login', async (req, res, next) => {
try {
const db = await connectToDatabase();
const collection = db.collection('users');

const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({ message: 'Email and password are required' });
}

const user = await collection.findOne({ email: email });

if (!user) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

const passwordMatches = await bcrypt.compare(password, user.password);

if (!passwordMatches) {
  return res.status(401).json({ message: 'Invalid email or password' });
}

const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET || 'giftlink-secret-key',
  { expiresIn: '1d' }
);

return res.status(200).json({
  message: 'Login successful',
  token: token
});

} catch (error) {
next(error);
}
});

module.exports = router;
