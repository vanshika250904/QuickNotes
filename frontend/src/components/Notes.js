import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notes`, { withCredentials: true });
      console.log('[Notes] fetchNotes response:', res.data);
      setNotes(res.data || []);
    } catch (err) {
      console.error('[Notes] fetchNotes error', err);
      setNotes([]);
    }
  };

  const addNote = async () => {
    if (text.trim()) {
  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notes`, { content: text }, { withCredentials: true });
      setText("");
      fetchNotes();
    }
  };

  const deleteNote = async (id) => {
  await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/notes/${id}`, { withCredentials: true });
    fetchNotes();
  };

  const logout = () => {
  window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/logout`;
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
