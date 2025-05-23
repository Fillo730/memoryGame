import mongoose from 'mongoose';

const GameStatsSchema = new mongoose.Schema({
  completed: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  firstName: String,
  lastName: String,
  password: { type: String, required: true },
  gamesCompleted: {
    Easy: GameStatsSchema,
    Medium: GameStatsSchema,
    Hard: GameStatsSchema,
    Extreme: GameStatsSchema,
    Impossible: GameStatsSchema,
    Legendary: GameStatsSchema,
    Mythical: GameStatsSchema,
    Divine: GameStatsSchema,
    Godlike: GameStatsSchema
  }
});

export default mongoose.model('User', userSchema);