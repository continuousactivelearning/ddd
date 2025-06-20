import { BarChart3, Clock, Flame, ListChecks } from "lucide-react";
import DashboardCard from "../components/Dashboard/DashboardCard";
import ProgressChart from "../components/Charts/ProgressChart";
import ACChart from "../components/Charts/XPChart";
import PerformanceMeter from "../components/Charts/PerformanceMeter";
import MiniGames from "../components/Gamification/MiniGames";
import Courses from "../components/Dashboard/Courses";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import Streak  from "../components/Dashboard/Streak";
import Badges from "../components/Dashboard/Badges";
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

  useEffect(() => {
    document.body.className = theme; // sets class on body
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
            <PerformanceMeter />
            <div className="label">Today's Meter</div>
            <div className="sublabel">Activity Summary</div>
          </div>
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
    </div>
  );
};

export default DashboardOverview;
