import express from "express";
import Note from "../models/Note.js";
const router = express.Router();

const ensureAuth = (req, res, next) => {
  if (req.user) return next();
  res.status(401).json({ message: "Unauthorized" });
};

router.get("/", ensureAuth, async (req, res) => {
  const notes = await Note.find({ userId: req.user._id });
  res.json(notes);
});

router.post("/", ensureAuth, async (req, res) => {
  const note = await Note.create({ userId: req.user._id, content: req.body.content });
  res.json(note);
});

router.delete("/:id", ensureAuth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Note deleted" });
});

export default router;
