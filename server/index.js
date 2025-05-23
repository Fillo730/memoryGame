// Libraries
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import './database/db.js';
import User from './database/models/user.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Register
app.post('/api/register', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  console.log(`[REGISTER] Attempt - Username: ${username}, FirstName: ${firstName}, LastName: ${lastName}`);

  const userExists = await User.findOne({ username });
  if (userExists) {
    console.warn(`[REGISTER] Failed - Username '${username}' already exists`);
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    firstName,
    lastName,
    password: hashedPassword,
    gamesCompleted: {
      Easy: {}, Medium: {}, Hard: {}, Extreme: {}, Impossible: {},
      Legendary: {}, Mythical: {}, Divine: {}, Godlike: {}
    }
  });

  await newUser.save();
  console.log(`[REGISTER] Success - Username: ${username}`);
  res.json({ message: 'Registration completed' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[LOGIN] Attempt - Username: ${username}`);

  const user = await User.findOne({ username });
  if (!user) {
    console.warn(`[LOGIN] Failed - Username '${username}' not found`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.warn(`[LOGIN] Failed - Invalid password for user '${username}'`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log(`[LOGIN] Success - Username: ${username}`);
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Record game
app.post('/api/play', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('[PLAY] Failed - Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { difficulty, moves } = req.body;

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      console.warn(`[PLAY] Failed - User '${decoded.username}' not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!difficulty || typeof moves !== 'number') {
      console.warn(`[PLAY] Failed - Invalid input - Difficulty: ${difficulty}, Moves: ${moves}`);
      return res.status(400).json({ error: 'Invalid input' });
    }

    if (!user.gamesCompleted[difficulty]) {
      console.warn(`[PLAY] Failed - Invalid difficulty '${difficulty}' for user '${decoded.username}'`);
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const stats = user.gamesCompleted[difficulty];
    stats.completed = (stats.completed || 0) + 1;
    stats.totalAttempts = (stats.totalAttempts || 0) + moves;
    if(stats.bestScore === 0) {
      stats.bestScore = moves;
    }
    else {
      stats.bestScore = Math.min(stats.bestScore, moves);
    }

    await user.save();
    console.log(`[PLAY] Success - Username: ${decoded.username}, Difficulty: ${difficulty}, Moves: ${moves}`);
    res.json({ message: `Game recorded for ${difficulty}`, gamesCompleted: user.gamesCompleted });
  } catch (err) {
    console.warn('[PLAY] Failed - Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// User statistics
app.get('/api/stats', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('[STATS] Failed - Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      console.warn(`[STATS] Failed - User '${decoded.username}' not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[STATS] Success - Username: ${decoded.username}`);
    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      gamesCompleted: user.gamesCompleted
    });
  } catch {
    console.warn('[STATS] Failed - Invalid token');
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user profile
app.put('/api/update-profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('[UPDATE_PROFILE] Failed - Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { username, firstName, lastName } = req.body;

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      console.warn(`[UPDATE_PROFILE] Failed - User '${decoded.username}' not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && !existingUser._id.equals(user._id)) {
        console.warn(`[UPDATE_PROFILE] Failed - Username '${username}' already taken`);
         return res.status(400).json({ error: 'Username already taken' });
      }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    await user.save();
    console.log(`[UPDATE_PROFILE] Success - Username: ${decoded.username}`);
    const newToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Profile updated successfully', user, token: newToken });
  } catch (err) {
    console.warn('[UPDATE_PROFILE] Failed - Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Start server
app.listen(3001, () => console.log('[SERVER] Running at http://localhost:3001'));