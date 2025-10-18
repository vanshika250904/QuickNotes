import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import './config/passport.js';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';

dotenv.config();
const app = express();

// ----------------- Redis Setup -----------------
const RedisStore = connectRedis(session);
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

// ----------------- Middlewares -----------------
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., https://quicknotes-3.onrender.com
  credentials: true
}));

app.use(express.json());

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // HTTPS only
    httpOnly: true,
    sameSite: "none",   // cross-origin
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ----------------- Routes -----------------
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// Simple test
app.get('/', (req, res) => res.send('Server is running!'));

// ----------------- DB & Server -----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));


