import { useEffect, useState } from "react";
import type { UserDashboardData } from "../data/SampleUserData";
import {sampleUserData } from "../data/SampleUserData";

const Settings = () => {
  const currentUserId = localStorage.getItem("currentUserId");
  const [user, setUser] = useState<UserDashboardData | null>(null);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("sampleUserData") || "[]") as UserDashboardData[];
    const data = localData.length > 0 ? localData : sampleUserData;
    const found = data.find(u => u.id === currentUserId);
    if (found) setUser(found);
  }, [currentUserId]);

  const updateUser = (field: keyof UserDashboardData, value: any) => {
    if (!user) return;
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);

    const allUsers = JSON.parse(localStorage.getItem("sampleUserData") || "[]") as UserDashboardData[] || sampleUserData;
    const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem("sampleUserData", JSON.stringify(updatedUsers));
  };

  if (!user) return <p style={{ paddingLeft: 220 }}>Loading...</p>;

  return (
    <div style={{ padding: "32px", paddingLeft: "230px", backgroundColor: "transparent", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>⚙️ Settings</h1>
      <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "24px" }}>Manage your account preferences and privacy settings</p>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", maxWidth: "700px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 600 }}>🧑 Account Info</h2>
        
        <label style={labelStyle}>Full Name</label>
        <input
          style={inputStyle}
          value={user.name}
          onChange={e => updateUser("name", e.target.value)}
        />

        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          value={user.email || ""}
          onChange={e => updateUser("email", e.target.value)}
          placeholder="Enter your email"
        />

        <label style={labelStyle}>Role</label>
        <input
          style={inputStyle}
          value={user.role || ""}
          onChange={e => updateUser("role", e.target.value)}
          placeholder="Student, Mentor, etc."
        />

        <label style={labelStyle}>Avatar URL</label>
        <input
          style={inputStyle}
          value={user.avatar || ""}
          onChange={e => updateUser("avatar", e.target.value)}
          placeholder="Path or URL to avatar"
        />

        <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
          <button
            style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}
            onClick={() => alert("Changes saved!")}>
            Save Changes
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
            onClick={() => localStorage.removeItem("currentUserId")}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "6px",
  marginTop: "16px",
  display: "block"
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "white"
};

const buttonStyle = {
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer"
};

export default Settings;
