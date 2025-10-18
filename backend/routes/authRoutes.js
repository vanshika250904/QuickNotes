import express from "express";
import passport from "passport";

const router = express.Router();

// Google login route
router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account"
}));

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://quicknotes-3.onrender.com/login",
  }),
  (req, res) => {
    res.redirect("https://quicknotes-3.onrender.com/notes");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://quicknotes-3.onrender.com/login");
  });
});

// Check user session
router.get("/user", (req, res) => {
  res.send(req.user || null);
});

export default router;
