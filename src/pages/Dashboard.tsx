import { BarChart3, Clock, Flame, ListChecks, MessageCircle, X } from "lucide-react";
import DashboardCard from "../components/Dashboard/DashboardCard";
import ProgressChart from "../components/Charts/ProgressChart";
import ACChart from "../components/Charts/XPChart";
import EvaluationMeter from "../components/Charts/PerformanceMeter";
import MiniGames from "../components/Gamification/MiniGames";
import Courses from "../components/Dashboard/Courses";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import Streak from "../components/Dashboard/Streak";
import Badges from "../components/Dashboard/Badges";
import EducationalChatbot from "./DDD-chatbot"; 
import PeerComparisonRadar from "../components/Charts/PeerComparisonRadar";
import "./styles.css";
import { useEffect, useState } from "react";

const metrics = [
  {
    icon: <Clock size={24} />,
    title: "Watch Time",
    value: "12h 30m",
    subtitle: "Weekly Total",
    change: "+5.4%",
  },
  {
    icon: <ListChecks size={24} />,
    title: "Videos Completed",
    value: "36",
    subtitle: "In This Week",
    change: "+8.2%",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Evaluation Completed",
    value: "59%",
    subtitle: "Average",
    change: "+1.5%",
  },
  {
    icon: <Flame size={24} />,
    title: "Current Streak",
    value: "7 Days",
    subtitle: "Daily Activity",
    change: "🔥",
  },
];

const DashboardOverview = () => {
  const [theme, setTheme] = useState("light");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="dashboard-new">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">
          PES Dashboard
          <b>
            <div className="label">Welcome to your Dashboard!</div>
          </b>
        </h1>
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* Top Metrics */}
      <div className="metrics-row">
        {metrics.map((m) => (
          <DashboardCard
            key={m.title}
            icon={m.icon}
            title={m.title}
            value={m.value}
            subtitle={m.subtitle}
            change={m.change}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="vertical-charts">
        <div className="dashboard-card">
          <div className="card-content">
            <ProgressChart />
            <div className="label">Weekly Progress</div>
            <div className="sublabel">Your learning growth</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <ACChart />
            <div className="label">XP Performance</div>
            <div className="sublabel">Weekly Accuracy</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <EvaluationMeter />
            <div className="label">Today's Meter</div>
            <div className="sublabel">Activity Summary</div>
          </div>
        </div>
      </div>

       {/* ✅ Peer Comparison Section */}
      <div className="dashboard-card">
        <div className="card-content">
          <PeerComparisonRadar />
        </div>
      </div>

      {/* Mini Games */}
      <div className="dashboard-card minigames-card">
        <div className="card-content">
          <h3 className="label">Mini Games</h3>
          <MiniGames />
        </div>
      </div>
      <div className="dashboard-card minigames-card">
        <div className="card-content">
          <Courses/>
          <h3 className="label">Courses </h3>
        </div>
      </div>

      {/* Streak & Badges Section */}
      <div className="streaks-badges-section">
        <div className="dashboard-card">
          <div className="card-content">
            <Streak />
            <h3 className="label">Your Streak</h3>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="card-content-badges">
            <Badges />
             <h3 className="label">Achievement Badges</h3>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="dashboard-card leaderboard-card">
        <div className="card-content">
          <Leaderboard />
          <h3 className="label">Leaderboard</h3>
        </div>
      </div>

      {/* Enhanced Floating Chat Icon */}
      <div 
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(79, 70, 229, 0.6)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.4)';
        }}
      >
        <MessageCircle color="white" size={28} />
        {/* Notification dot */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '12px',
          height: '12px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          border: '2px solid white',
          animation: 'pulse 1.5s infinite'
        }} />
      </div>

      {/* Enhanced Floating Chat Window */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '420px',
          height: '580px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          zIndex: 1001,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Enhanced Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '20px 20px 0 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={18} />
              </div>
              <div>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>DDD Assistant</span>
                <div style={{ fontSize: '12px', opacity: '0.9' }}>
                  Making learning engaging ✨
                </div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Chat Content */}
          <div style={{ height: 'calc(100% - 72px)' }}>
            <EducationalChatbot />
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes slideUp {
          from { 
            transform: translateY(20px) scale(0.95); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;