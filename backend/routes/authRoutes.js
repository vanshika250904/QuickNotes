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
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login"
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/login");
  });
});

router.get("/user", (req, res) => {
  res.send(req.user || null);
});

export default router;
