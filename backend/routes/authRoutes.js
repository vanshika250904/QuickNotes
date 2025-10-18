import express from 'express';
import passport from 'passport';
const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', (req, res, next) => {
  // Use custom callback to log session/user info for debugging
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      console.error('[/auth/google/callback] auth error', err);
      return res.redirect(process.env.FRONTEND_URL + '/login');
    }
    if (!user) {
      console.log('[/auth/google/callback] no user returned by passport');
      return res.redirect(process.env.FRONTEND_URL + '/login');
    }
    // log user and session before login
    console.log('[/auth/google/callback] passport user:', { id: user.id, googleId: user.googleId });
    // Establish login session
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('[/auth/google/callback] req.logIn error', loginErr);
        return res.redirect(process.env.FRONTEND_URL + '/login');
      }
      // After login, inspect session and cookie header
      console.log('[/auth/google/callback] session:', req.sessionID ? { sessionID: req.sessionID } : null);
      console.log('[/auth/google/callback] headers.cookie:', req.headers.cookie);
      // Redirect to frontend notes page
      return res.redirect(process.env.FRONTEND_URL + '/notes');
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL + '/login');
  });
});

// Get logged-in user
router.get('/user', (req, res) => {
  // DEBUG: log cookie and user presence for troubleshooting
  console.log('[/auth/user] cookies:', req.headers.cookie);
  console.log('[/auth/user] req.user present?', !!req.user);
  res.send(req.user || null);
});

export default router;
