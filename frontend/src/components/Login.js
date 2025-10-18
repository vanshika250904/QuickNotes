import React from "react";

export default function Login() {
  const popupLogin = () => {
    const backendAuthUrl = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
    const width = 600, height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(backendAuthUrl, 'oauth', `width=${width},height=${height},left=${left},top=${top}`);

    // Listen for message from popup
    const listener = (e) => {
      const allowedOrigin = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
      if (e.origin !== allowedOrigin) return;
      if (e.data && e.data.type === 'oauth') {
        // We received the user; reload parent to pick up session or navigate
        window.location.href = '/notes';
      }
    };
    window.addEventListener('message', listener, false);
  };

  return (
    <div className="container">
      <h1>QuickNotes</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        A simple and secure way to store your personal notes
      </p>
      <button onClick={popupLogin} style={{ fontSize: "16px" }}>
        Login with Google
      </button>
    </div>
  );
}
