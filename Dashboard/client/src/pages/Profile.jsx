import '../styles/Profile.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login"); 
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <Link to="/answer" className="link">Answer the question</Link><br />
      {user.role === "host" && (
        <div className="host-actions">
          <h3>Host Controls</h3>
          <Link to="/post-question" className="question">Post Questions</Link><br />
          <Link to="/leadboard" className="Leadboard">Lead Board</Link><br />
          <Link to="/questions" className="link">View All Questions</Link>
        </div>
      )}
      <br /><br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;