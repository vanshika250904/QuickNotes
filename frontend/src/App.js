import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Notes from "./components/Notes";

axios.defaults.withCredentials = true; // important for sessions

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true })
        .then((res) => {
          if (res.data) setUser(res.data);
        })
        .catch(() => {
          // leave user null
        })
        .finally(() => setLoading(false));
    // also listen for oauth popup messages
    const onMessage = (e) => {
      const allowedOrigin = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
      if (e.origin !== allowedOrigin) return;
      if (e.data && e.data.type === 'oauth') {
        if (e.data.user) setUser(e.data.user);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);


  return loading ? (
    <div>Loading...</div>
  ) : (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/notes" /> : <Navigate to="/login" />} />
      <Route path="/notes" element={user ? <Notes user={user} /> : <Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppWrapper;
