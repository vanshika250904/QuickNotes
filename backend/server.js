import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import './config/passport.js';

import { createClient } from 'redis';
import * as connectRedis from 'connect-redis'; // <-- named import, do NOT use default

dotenv.config();
const app = express();

// --- CORS ---
app.use(
  cors({
    origin: 'https://quicknotes-3.onrender.com',
    credentials: true,
  })
);

app.use(express.json());

// --- Redis + session ---
const RedisStore = connectRedis.default(session) || connectRedis.RedisStore || connectRedis.ConnectRedis; // safe fallback

const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// --- Health check ---
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// --- MongoDB ---
import mongoose from 'mongoose';
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
