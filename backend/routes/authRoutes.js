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
      // After login, save the session to ensure session cookie is set before redirecting
      req.session.save((saveErr) => {
        if (saveErr) console.error('[/auth/google/callback] session save error', saveErr);
        console.log('[/auth/google/callback] session saved:', req.sessionID ? { sessionID: req.sessionID } : null);
        console.log('[/auth/google/callback] headers.cookie:', req.headers.cookie);
        // Redirect to a backend-rendered success page (same origin) which will postMessage the user to the opener
        return res.redirect('/auth/success');
      });
    });
  })(req, res, next);
});

// OAuth success page shown inside popup: posts user to opener window then closes
router.get('/success', (req, res) => {
  const frontendOrigin = process.env.FRONTEND_URL || 'https://quicknotes-3.onrender.com';
  const user = req.user ? { id: req.user._id || req.user.id, name: req.user.name, email: req.user.email } : null;
  res.send(`<!doctype html>
  <html>
    <head><title>Auth success</title></head>
    <body>
      <script>
        try {
          const user = ${JSON.stringify(user)};
          // Post the user to the opener (parent window) and then close the popup
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'oauth', user }, '${frontendOrigin}');
          }
        } catch (e) { console.error(e); }
        window.close();
      </script>
    </body>
  </html>`);
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
