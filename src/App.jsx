import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./UI/Home";
import Signup from "./UI/Signup";
import Login from "./UI/Login";
import Navhome from "./Pages/Navhome";
import Notesapp from "./UI/Notesapp";
import Notes from "./Pages/Notes";
import Journal from "./Pages/Journal.jsx";
import Settings from "./Pages/Settings.jsx";
// import Sidebar from "./UI/Sidebar";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navhome" element={<Navhome />} />
        <Route path="/notesapp" element={<Notesapp />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;
