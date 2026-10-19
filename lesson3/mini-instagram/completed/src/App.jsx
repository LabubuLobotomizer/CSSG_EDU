import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
