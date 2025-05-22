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
  console.log("Registration attempt // username:", username, "FirstName:", firstName, "LastName:", lastName);

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    username,
    firstName,
    lastName,
    password: hashedPassword,
    gamesCompleted: JSON.parse(JSON.stringify(initialGamesCompleted))
  });
  res.json({ message: 'Registration completed' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt // username:", username, "Password:", password);

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});


// Profile
app.get('/api/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Welcome ${decoded.username}` });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Record a played game
app.post('/api/play', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = users.find(u => u.username === decoded.username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { difficulty, moves} = req.body;
    console.log("Game played attempt // username:", decoded.username, "Difficulty:", difficulty, "Moves:", moves);
    if (!user.gamesCompleted.hasOwnProperty(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    user.gamesCompleted[difficulty].completed += 1;
    user.gamesCompleted[difficulty].totalAttempts += moves;
    user.gamesCompleted[difficulty].bestScore = Math.min(user.gamesCompleted[difficulty].bestScore || moves, moves);
    res.json({ message: `Game recorded for ${difficulty}`, gamesCompleted: user.gamesCompleted });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// User statistics
app.get('/api/stats', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = users.find(u => u.username === decoded.username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      gamesCompleted: user.gamesCompleted
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Server start
app.listen(3001, () => console.log('Backend running at http://localhost:3001'));