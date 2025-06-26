import {
  BookOpen,
  Activity,
  CalendarDays,
  Settings,
  Medal,
  Users,
  BarChart3 // ✅ NEW ICON
} from "lucide-react";
import "./sidebar.css";
import userAvatar from '../../assets/user-avatar.jpg';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="user-profile">
        <img src={userAvatar} alt="User Avatar" className="user-avatar" />
        <h2 className="user-name">Gaurpad Shukla</h2>
        <div className="user-role">Student</div>
      </div>

      <ul className="menu">
        <li onClick={() => navigate("/my-courses")}><BookOpen size={20} /> My Courses</li>
        <li onClick={() => navigate("/course-activity")}><Activity size={20} /> Course Activity</li>
        <li onClick={() => navigate("/achievements")}><Medal size={20} /> Achievements</li>
        <li onClick={() => navigate("/calendar")}><CalendarDays size={20} /> Calendar</li>
        <li onClick={() => navigate("/peer-review")}><Users size={20} /> Peer Reviews</li>
        <li onClick={() => navigate("/feedback-trends")}><BarChart3 size={20} /> Feedback Trends</li> {/* ✅ NEW */}
        <li onClick={() => navigate("/settings")}><Settings size={20} /> Settings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
