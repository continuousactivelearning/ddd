import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PeerReviewDashboard = () => {
  const [invitations] = useState([
    { id: 1, name: "Anshika Shukla", topic: "Teamwork", instructor: "Dr. A. Kumar", deadline: "Tomorrow", rating: 4.5 },
    { id: 2, name: "Gaurpad Shukla", topic: "Communication", instructor: "Prof. R. Rao", deadline: "Friday", rating: 4.2 },
    { id: 3, name: "Yogesh", topic: "Creativity", instructor: "Dr. M. Singh", deadline: "Monday", rating: 4.8 },
  ]);

  const [activeReviews] = useState([
    { id: 4, name: "Jhalak", topic: "Problem Solving", progress: 60 },
    { id: 5, name: "Raj Singh", topic: "Technical Skills", progress: 30 },
    { id: 6, name: "Priya Patel", topic: "Leadership", progress: 80 },
  ]);

  const [pastReviews] = useState([
    { id: 7, name: "Piyush Verma", topic: "Teamwork", summary: "Excellent collaborator.", score: 9 },
    { id: 8, name: "Ram Singh", topic: "Communication", summary: "Clear and concise.", score: 8 },
    { id: 9, name: "Mohit Sharma", topic: "Initiative", summary: "Great leadership.", score: 10 },
  ]);

  const chartData = [
    { name: "Invitations", value: invitations.length },
    { name: "Active", value: activeReviews.length },
    { name: "Past", value: pastReviews.length },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "#10b981";
    if (progress >= 60) return "#3b82f6";
    if (progress >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div
      style={{
        padding: "32px",
        paddingLeft: "230px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1e293b",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <ClipboardList size={24} /> Peer Review Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>
          Manage your ongoing, past, and invited peer reviews
        </p>
      </div>

      {/* Pie Chart */}
      <div style={{ marginBottom: "48px", display: "flex", justifyContent: "center" }}>
        <PieChart width={300} height={250}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Invitations */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", marginBottom: "16px" }}>
        📨 Review Invitations
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        {invitations.map(invite => (
          <div
            key={invite.id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>{invite.name}</h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Topic: {invite.topic}</p>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Instructor: {invite.instructor}</p>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Due: {invite.deadline}</p>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button
                style={{
                  flex: 1,
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "8px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#059669"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#10b981"}
              >
                Accept
              </button>
              <button
                style={{
                  flex: 1,
                  backgroundColor: "#f3f4f6",
                  color: "#111827",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.color = "#111827";
                }}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Reviews */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", marginBottom: "16px" }}>
        🟢 Active Reviews
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        {activeReviews.map(review => (
          <div
            key={review.id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>{review.name}</h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>Topic: {review.topic}</p>
            <p style={{ fontSize: "14px", color: getProgressColor(review.progress), fontWeight: 600 }}>
              {review.progress}% completed
            </p>
            <div style={{ height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden", marginTop: "4px" }}>
              <div
                style={{
                  height: "100%",
                  backgroundColor: getProgressColor(review.progress),
                  width: `${review.progress}%`,
                  transition: "width 0.3s ease"
                }}
              ></div>
            </div>
            <button
              style={{
                marginTop: "12px",
                width: "100%",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3b82f6"}
            >
              Continue
            </button>
          </div>
        ))}
      </div>

      {/* Past Reviews */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", marginBottom: "16px" }}>
        ✅ Past Reviews
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
        {pastReviews.map(past => (
          <div
            key={past.id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>{past.name}</h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>Topic: {past.topic}</p>
            <p style={{ fontSize: "14px", color: "#475569", fontStyle: "italic" }}>"{past.summary}"</p>
            <p style={{ fontSize: "14px", color: "#10b981", fontWeight: 600 }}>Score: {past.score}/10</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeerReviewDashboard;
