import { useState } from 'react';
import { ClipboardList, LineChart, Smile, ShieldCheck } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

const PeerReviewDashboard = () => {
  const [accepted, setAccepted] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const invitations = [
    { id: 1, name: "Anshika Shukla", topic: "Teamwork", instructor: "Dr. A. Kumar", deadline: "Tomorrow", rating: 4.5 },
    { id: 2, name: "Gaurpad Shukla", topic: "Communication", instructor: "Prof. R. Rao", deadline: "Friday", rating: 4.2 },
    { id: 3, name: "Yogesh", topic: "Creativity", instructor: "Dr. M. Singh", deadline: "Monday", rating: 4.8 },
  ];

  const activeReviews = [
    { id: 4, name: "Jhalak", topic: "Problem Solving", progress: 60 },
    { id: 5, name: "Raj Singh", topic: "Technical Skills", progress: 30 },
    { id: 6, name: "Priya Patel", topic: "Leadership", progress: 80 },
  ];

  const pastReviews = [
    { id: 7, name: "Piyush Verma", topic: "Teamwork", summary: "Excellent collaborator.", score: 9 },
    { id: 8, name: "Ram Singh", topic: "Communication", summary: "Clear and concise.", score: 8 },
    { id: 9, name: "Mohit Sharma", topic: "Initiative", summary: "Great leadership.", score: 10 },
  ];

  const chartData = [
    { name: "Invitations", value: invitations.length },
    { name: "Active", value: activeReviews.length },
    { name: "Past", value: pastReviews.length },
  ];

  const analyticsData = [
    { name: "Feedback Quality", score: 8.7 },
    { name: "Reviewer Reliability", score: 9.2 },
    { name: "Sentiment Positivity", score: 7.8 },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "#10b981";
    if (progress >= 60) return "#3b82f6";
    if (progress >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{ padding: "32px", paddingLeft: "230px", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
          <ClipboardList size={24} /> Peer Review Dashboard
        </h1>
        <p style={{ color: "#64748b" }}>Manage your ongoing, past, and invited peer reviews</p>
      </div>

      {/* Pie Chart */}
      <div style={{ marginBottom: "48px", display: "flex", justifyContent: "center" }}>
        <PieChart width={300} height={250}>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Invitations */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>📨 Review Invitations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        {invitations.map(invite => (
          <div key={invite.id} style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            lineHeight: "1.9"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>{invite.name}</h3>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Topic: {invite.topic}</p>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Instructor: {invite.instructor}</p>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Due: {invite.deadline}</p>

            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button
                style={{ flex: 1, backgroundColor: "#10b981", color: "white", padding: "8px", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
                onClick={() => setAccepted(prev => [...prev, invite.id])}
              >
                Accept
              </button>
              <button
                style={{ flex: 1, backgroundColor: "#f3f4f6", color: "#111827", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
              >
                Decline
              </button>
            </div>

            {accepted.includes(invite.id) && (
              <>
                <textarea
                  placeholder="Write your review or note here..."
                  value={notes[invite.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [invite.id]: e.target.value })}
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#1e293b",
                    lineHeight: "1.6"
                  }}
                />
                <button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setSubmitted(prev => ({ ...prev, [invite.id]: true }));
                    alert("Submitted successfully!");
                  }}
                >
                  Submit
                </button>
                {submitted[invite.id] && <p style={{ color: "#16a34a", marginTop: "8px" }}>✅ Submitted</p>}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Active Reviews */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>🟢 Active Reviews</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        {activeReviews.map(review => (
          <div key={review.id} style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            lineHeight: "1.9"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>{review.name}</h3>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Topic: {review.topic}</p>
            <p style={{ fontSize: "14px", color: getProgressColor(review.progress), fontWeight: 600 }}>{review.progress}% completed</p>
            <div style={{ height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden", marginTop: "4px" }}>
              <div style={{
                height: "100%",
                backgroundColor: getProgressColor(review.progress),
                width: `${review.progress}%`,
                transition: "width 0.3s ease"
              }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Past Reviews */}
      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>✅ Past Reviews</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "60px" }}>
        {pastReviews.map(past => (
          <div key={past.id} style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            lineHeight: "1.9"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>{past.name}</h3>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Topic: {past.topic}</p>
            <p style={{ fontSize: "14px", color: "#475569", fontStyle: "italic" }}>"{past.summary}"</p>
            <p style={{ fontSize: "14px", color: "#10b981", fontWeight: 600 }}>Score: {past.score}/10</p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1e293b", marginBottom: "20px" }}>📈 Peer Review Insights</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
        <AnalyticsCard icon={<LineChart size={20} color="#3b82f6" />} title="Feedback Quality" score="8.7 / 10" desc="AI heuristics show detailed and useful peer comments." />
        <AnalyticsCard icon={<ShieldCheck size={20} color="#10b981" />} title="Reviewer Reliability" score="9.2 / 10" desc="Most reviewers responded on time with clarity." />
        <AnalyticsCard icon={<Smile size={20} color="#f59e0b" />} title="Sentiment Positivity" score="7.8 / 10" desc="Tone analysis shows 82% responses were positive." />
      </div>

      {/* Bar Chart */}
      <div style={{ marginTop: "48px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", marginBottom: "12px" }}>📊 Trend Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData} barCategoryGap={50} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeerReviewDashboard;

const AnalyticsCard = ({ icon, title, score, desc }: { icon: React.ReactNode, title: string, score: string, desc: string }) => (
  <div style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, fontSize: "16px", color: "#1e293b", marginBottom: "10px" }}>
      {icon} {title}
    </div>
    <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>{score}</p>
    <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>{desc}</p>
  </div>
);
