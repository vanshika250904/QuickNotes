import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account"
}));


router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://quicknotes-1-g9k1.onrender.com/",
    failureRedirect: "https://quicknotes-1-g9k1.onrender.com/login"
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://quicknotes-1-g9k1.onrender.com/login");
  });
});

router.get("/user", (req, res) => {
  res.send(req.user || null);
});

export default router;
