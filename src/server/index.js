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
    username: 'admin', 
    firstName: '', 
    lastName: '', 
    password: bcrypt.hashSync('admin', 10),
    gamesPlayed: {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      level6: 0,
      level7: 0,
      level8: 0,
      level9: 0,
    }
  },
  {
    username: 'r', 
    firstName: 'r', 
    lastName: 'r', 
    password: bcrypt.hashSync('r', 10),
    gamesPlayed: {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      level6: 0,
      level7: 0,
      level8: 0,
      level9: 0,
    }
  }
]; 

// Register
app.post('/api/register', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  console.log("Registration attempt // username:", username, "FirstName:", firstName, "LastName:", lastName, "Password:", password);

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({
    username,
    firstName,
    lastName,
    password: hashedPassword,
    gamesPlayed: {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      level6: 0,
      level7: 0,
      level8: 0,
      level9: 0,
    }
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

    const { difficulty } = req.body;
    console.log("Game played attempt // username:", decoded.username, "Difficulty:", difficulty);
    if (!user.gamesPlayed.hasOwnProperty(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    user.gamesPlayed[difficulty]++;
    res.json({ message: `Game recorded for ${difficulty}`, gamesPlayed: user.gamesPlayed });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// User statistics
app.get('/api/stats', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  console.log("Stats retrieving attempt");

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = users.find(u => u.username === decoded.username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ gamesPlayed: user.gamesPlayed });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Server start
app.listen(3001, () => console.log('Backend running at http://localhost:3001'));