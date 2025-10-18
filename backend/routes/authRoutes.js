import express from 'express';
import passport from 'passport';
const router = express.Router();

// Start Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND_URL}/notes`,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  })
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  });
});

// Get current user
router.get('/user', (req, res) => {
  res.send(req.user || null);
});

export default router;
