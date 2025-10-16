import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Notes from "./components/Notes";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user").then(res => setUser(res.data));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Notes user={user} /> : <Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
