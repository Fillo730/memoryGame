import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'supersegreto123';
const users = [
  { username: 'admin', password: bcrypt.hashSync('admin', 10) },
]; 

app.post('/api/register', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  console.log("Registration attempt // username:", username, "FirstName: ",firstName," Lastname:",lastName,"password:", password);

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ error: 'Utente già esistente' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: 'Registrazione completata' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt // username:", username, "password:", password);

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Credentials are not valid' });

  const valid = await bcrypt.compare(password, user.password);
  if (!user) return res.status(401).json({ error: 'Credentials are not valid' });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token mancante' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Benvenuto ${decoded.username}` });
  } catch {
    res.status(401).json({ error: 'Token non valido' });
  }
});

app.listen(3001, () => console.log('Backend in ascolto su http://localhost:3001'));