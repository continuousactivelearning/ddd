import { BookOpen, Activity, CalendarDays, Settings, Medal } from "lucide-react";
import "./sidebar.css";
import userAvatar from '../../assets/user-avatar.jpg'; // adjust path as needed

<img
  src={userAvatar}
  alt="User Avatar"
  className="user-avatar"
/>

const Sidebar = () => (
  <aside className="sidebar">
    {/* 👤 User Image */}
    <div className=" user-profile">
      <img
  src={userAvatar}
  alt="User Avatar"
  className="user-avatar"
/>
      <h2 className="user-name">Gaurpad Shukla</h2>
      <div className="user-role">Student</div>
    </div>

    <ul className="menu">
      <li><BookOpen size={20} /> My Courses</li>
      <li><Activity size={20} /> Course Activity</li>
      <li><Medal size={20} /> Achievements</li>
      <li><CalendarDays size={20} /> Calendar</li>
      <li><Settings size={20} /> Settings</li>
    </ul>
  </aside>
);

export default Sidebar;
