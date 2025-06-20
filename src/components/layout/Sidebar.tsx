import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, BookOpen, User, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import Avatar from '../ui/Avatar';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/learning', icon: <BookOpen size={20} />, label: 'Learning' },
    { path: '/achievements', icon: <Trophy size={20} />, label: 'Achievements' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <aside
      className={`w-full md:w-64 md:flex-shrink-0 md:flex md:flex-col shadow-md z-10
      ${darkMode
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-gray-100 border-r border-gray-700'
        : 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-900 border-r border-gray-200'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-center md:justify-start mb-8 mt-2">
          <span className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold flex items-center tracking-wide">
            <Trophy className="mr-2" />
            VIBE
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-3 mb-8 p-3 rounded-xl bg-white/60 dark:bg-gray-700/60 shadow-inner">
          <Avatar src={user.avatar} alt={user.name} />
          <div>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.level} Level</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${isActive
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-600/20 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700/60'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/settings"
            className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700/60"
          >
            <Settings size={20} className="mr-3" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
