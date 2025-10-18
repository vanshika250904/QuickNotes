import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Notes from "./components/Notes";

axios.defaults.withCredentials = true;

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    axios.get("https://quicknotes-1-g9k1.onrender.com/auth/user")
      .then(res => {
        if (res.data) {
          setUser(res.data);
          navigate("/notes"); // redirect to notes if logged in
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, []);

  return (
    <Routes>
      <Route path="/" element={user ? <Notes user={user} /> : <Login />} />
      <Route path="/notes" element={user ? <Notes user={user} /> : <Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppWrapper;
