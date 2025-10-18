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
import { default as connectRedis } from 'connect-redis';

dotenv.config();
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL on Render
    credentials: true,
  })
);

app.use(express.json());

const RedisStore = connectRedis(session);
const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 24*60*60*1000,
    },
  })
);


// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// Default route
app.get('/', (req, res) => res.send('Server is running!'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));





