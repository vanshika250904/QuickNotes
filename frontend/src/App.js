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
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true })
      .then(res => {
        if (res.data) {
          setUser(res.data);
          navigate("/notes");
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
