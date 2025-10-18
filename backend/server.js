import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import './config/passport.js';

dotenv.config();
const app = express();


app.use(express.json());
app.use(
  cors({
    origin: "https://quicknotes-3.onrender.com",
    credentials: true,
  })
);

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,      
      httpOnly: true,    
      sameSite: "none",  
      maxAge: 24 * 60 * 60 * 1000 
    }
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
