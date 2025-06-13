import { BookOpen, Activity, CalendarDays, Settings, Medal } from "lucide-react";
import "./sidebar.css"

const Sidebar = () => (
  <aside className="sidebar">
    <h2>👤 Gaurpad Shukla</h2>
    <div className="text-sm text-gray-400 mb-4">Student</div>
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
