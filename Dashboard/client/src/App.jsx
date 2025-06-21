import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import PostQuestion from "./pages/PostQuestion";
import AnswerQuestions from "./pages/AnswerQuestions";
import ViewQuestions from "./pages/ViewQuestions";
import QuestionResponses from "./pages/QuestionResponses";
import Leaderboard from "./pages/LeadBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-question" element={<PostQuestion />} />
        <Route path="/answer" element={<AnswerQuestions />} />
        <Route path="/questions" element={<ViewQuestions />} />
        <Route path="/responses/:questionId" element={<QuestionResponses />} />
        <Route path="/leadboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
