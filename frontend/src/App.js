import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Notes from "./components/Notes";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://quicknotes-1-g9k1.onrender.com/auth/user", { withCredentials: true })
      .then(res => {
        if (res.data) {
          setUser(res.data);
          navigate("/"); // or navigate("/notes") if you prefer
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

// Wrap BrowserRouter outside App
export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
