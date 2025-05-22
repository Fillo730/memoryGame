//Libraries
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'supersecret123';

// Users array (It must be replaced with a database in production)
const users = [
  {
    username: 'r', 
    firstName: 'r', 
    lastName: 'r', 
    password: bcrypt.hashSync('r', 10),
    gamesCompleted: {
      Easy:      { completed: 0, totalAttempts: 0, bestScore: NaN },
      Medium:    { completed: 0, totalAttempts: 0, bestScore: NaN },
      Hard:      { completed: 0, totalAttempts: 0, bestScore: NaN },
      Extreme:   { completed: 0, totalAttempts: 0, bestScore: NaN },
      Impossible:{ completed: 0, totalAttempts: 0, bestScore: NaN },
      Legendary: { completed: 0, totalAttempts: 0, bestScore: NaN },
      Mythical:  { completed: 0, totalAttempts: 0, bestScore: NaN },
      Divine:    { completed: 0, totalAttempts: 0, bestScore: NaN },
      Godlike:   { completed: 0, totalAttempts: 0, bestScore: NaN }
    }
  }
];

// Register
app.post('/api/register', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  console.log(`[REGISTER] Attempt - Username: ${username}, FirstName: ${firstName}, LastName: ${lastName}`);

  const userExists = users.find(u => u.username === username);
  if (userExists) {
    console.warn(`[REGISTER] Failed - Username '${username}' already exists`);
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    username,
    firstName,
    lastName,
    password: hashedPassword,
    gamesCompleted: {
      Easy:      { completed: 0, totalAttempts: 0, bestScore: NaN },
      Medium:    { completed: 0, totalAttempts: 0, bestScore: NaN },
      Hard:      { completed: 0, totalAttempts: 0, bestScore: NaN },
      Extreme:   { completed: 0, totalAttempts: 0, bestScore: NaN },
      Impossible:{ completed: 0, totalAttempts: 0, bestScore: NaN },
      Legendary: { completed: 0, totalAttempts: 0, bestScore: NaN },
      Mythical:  { completed: 0, totalAttempts: 0, bestScore: NaN },
      Divine:    { completed: 0, totalAttempts: 0, bestScore: NaN },
      Godlike:   { completed: 0, totalAttempts: 0, bestScore: NaN }
    }
  });

  console.log(`[REGISTER] Success - Username: ${username}`);
  res.json({ message: 'Registration completed' });
});


// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[LOGIN] Attempt - Username: ${username}`);

  const user = users.find(u => u.username === username);
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
app.post('/api/play', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('[PLAY] Failed - Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const { difficulty, moves } = req.body;

    const user = users.find(u => u.username === decoded.username);
    if (!user) {
      console.warn(`[PLAY] Failed - User '${decoded.username}' not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!difficulty || typeof moves !== 'number') {
      console.warn(`[PLAY] Failed - Invalid input - Difficulty: ${difficulty}, Moves: ${moves}`);
      return res.status(400).json({ error: 'Invalid input' });
    }

    if (!user.gamesCompleted.hasOwnProperty(difficulty)) {
      console.warn(`[PLAY] Failed - Invalid difficulty '${difficulty}' for user '${decoded.username}'`);
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    user.gamesCompleted[difficulty].completed += 1;
    user.gamesCompleted[difficulty].totalAttempts += moves;
    user.gamesCompleted[difficulty].bestScore = Math.min(
      isNaN(user.gamesCompleted[difficulty].bestScore) ? moves : user.gamesCompleted[difficulty].bestScore,
      moves
    );

    console.log(`[PLAY] Success - Username: ${decoded.username}, Difficulty: ${difficulty}, Moves: ${moves}`);
    res.json({ message: `Game recorded for ${difficulty}`, gamesCompleted: user.gamesCompleted });
  } catch (err) {
    console.warn('[PLAY] Failed - Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// User statistics
app.get('/api/stats', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    console.warn('[STATS] Failed - Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = users.find(u => u.username === decoded.username);
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

// Start server
app.listen(3001, () => console.log('[SERVER] Running at http://localhost:3001'));