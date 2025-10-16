import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
  userId: String,
  content: String
});
export default mongoose.model("Note", noteSchema);
