import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import PostQuestion from "./pages/PostQuestion";
import AnswerQuestions from "./pages/AnswerQuestions";
import ViewResponses from "./pages/ViewResponses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-question" element={<PostQuestion />} />
        <Route path="/answer" element={<AnswerQuestions />} />
        <Route path="/responses" element={<ViewResponses />} />
      </Routes>
    </Router>
  );
}

export default App;
