import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:5000/notes");
    setNotes(res.data);
  };

  const addNote = async () => {
    if (text.trim()) {
      await axios.post("http://localhost:5000/notes", { content: text });
      setText("");
      fetchNotes();
    }
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    fetchNotes();
  };

  const logout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h2>Welcome, {user.name.split(" ")[0]}</h2>
      <button
        onClick={logout}
        style={{
          marginTop: "10px",
          backgroundColor: "#6b7280",
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: "30px" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here..."
        />
        <br />
        <button
          onClick={addNote}
          style={{ marginTop: "10px", backgroundColor: "#16a34a" }}
        >
          Add Note
        </button>
      </div>

      <ul style={{ marginTop: "40px" }}>
        {notes.map((n) => (
          <li key={n._id}>
            <span>{n.content}</span>
            <button onClick={() => deleteNote(n._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
