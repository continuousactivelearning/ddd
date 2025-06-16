import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <Link to="/answer" className="link">Answer the question</Link>
      {user.role === "host" && (<Link to="/responses" className="link">View Student Responses</Link>)}
    </div>
  );
}

export default Profile;