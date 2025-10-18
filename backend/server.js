import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import './config/passport.js';

import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';  // ✅ correct named import

dotenv.config();
const app = express();

// --- CORS ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://quicknotes-3.onrender.com',
    credentials: true,
  })
);

app.use(express.json());

// --- Redis + session ---
// We'll try to connect to Redis at startup. If it fails, fall back to the default MemoryStore
// so the server still runs (useful for local dev when Redis is unavailable).
async function initSessionAndStart() {
  let sessionStore = undefined;

  if (process.env.REDIS_URL) {
    try {
      const redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      sessionStore = new RedisStore({ client: redisClient });
      console.log('[server] connected to Redis and configured session store');
    } catch (err) {
      console.error('[server] Redis connection failed, falling back to MemoryStore:', err.message || err);
    }
  } else {
    console.log('[server] REDIS_URL not set; using MemoryStore for sessions');
  }

  app.use(
    session({
      store: sessionStore, // undefined uses default MemoryStore
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Use secure cookies in production (requires HTTPS). Allow non-secure for local dev.
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none', // cross-origin
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  // Log session cookie config for debugging
  console.log('[server] session cookie config:', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

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
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

// Defer initialization
import mongoose from 'mongoose';
initSessionAndStart();

