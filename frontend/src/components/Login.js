import React from "react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="container">
      <h1>QuickNotes</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        A simple and secure way to store your personal notes
      </p>
      <button onClick={handleLogin} style={{ fontSize: "16px" }}>
        Login with Google
      </button>
    </div>
  );
}
