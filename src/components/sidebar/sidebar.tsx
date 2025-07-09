import {
  BookOpen,
  Activity,
  CalendarDays,
  Settings,
  Medal,
  Users,
  BarChart3,
  FilePlus,
} from "lucide-react";
import userAvatarFallback from '../../assets/user-avatar.jpg';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext"; // ✅ import auth context
import "../../pages/styles.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ get logged-in user from context

  if (!user) return null; // ⛔ If user is not authenticated, don’t show sidebar

  return (
    <aside className="sidebar" style={{ overflowY: "auto", maxHeight: "100vh" }}>
      <div className="user-profile">
        <img
          src={user.avatar || userAvatarFallback}
          alt="User Avatar"
          className="user-avatar"
        />
        <h2 className="user-name">{user.name}</h2>
        <div className="user-role">{user.role || "Student"}</div>
      </div>

      <ul className="menu">
        <li onClick={() => navigate("/my-courses")}><BookOpen size={20} /> My Courses</li>
        <li onClick={() => navigate("/course-activity")}><Activity size={20} /> Course Activity</li>
        <li onClick={() => navigate("/achievements")}><Medal size={20} /> Achievements</li>
        <li onClick={() => navigate("/Assignmentsubmission")}><FilePlus size={20} /> Assignment Submission</li>
        <li onClick={() => navigate("/AssignmentEvaluation")}><FilePlus size={20} /> Assignment Evaluation</li>
        <li onClick={() => navigate("/calendar")}><CalendarDays size={20} /> Calendar</li>
        <li onClick={() => navigate("/peer-review")}><Users size={20} /> Peer Reviews</li>
        <li onClick={() => navigate("/feedback-trends")}><BarChart3 size={20} /> Feedback Trends</li>
        <li onClick={() => navigate("/settings")}><Settings size={20} /> Settings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
