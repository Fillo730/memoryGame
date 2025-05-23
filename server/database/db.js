// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('[DB] Connesso a MongoDB Atlas'))
.catch(err => console.error('[DB] Errore di connessione:', err));