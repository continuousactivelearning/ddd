import { Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import Avatar from '../ui/Avatar';
import { useState } from 'react';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useUser();

  const [notifications] = useState([
    { id: 1, message: 'New course "Advanced React" added!' },
    { id: 2, message: 'You earned a badge: "30-Day Streak 🔥"' },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className={`px-4 py-2 border-b flex items-center justify-between ${
        darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-r from-white to-indigo-50 border-gray-200'
      }`}
    >
      <div className="flex items-center md:hidden">
        <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
          LearnPulse
        </span>
      </div>

      <div className="hidden md:flex items-center flex-1 mx-4">
        <div
          className={`flex items-center px-3 py-2 rounded-md w-full max-w-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search courses, topics..."
            className={`ml-2 flex-1 outline-none border-none ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            }`}
          />
        </div>
      </div>

      <div className="relative flex items-center space-x-3">
        <button
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
            <ul className="p-2 max-h-60 overflow-y-auto">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className="text-sm p-2 border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {note.message}
                </li>
              ))}
              {notifications.length === 0 && (
                <li className="text-sm p-2 text-gray-500 dark:text-gray-400">
                  No new notifications.
                </li>
              )}
            </ul>
          </div>
        )}

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? (
            <Sun size={20} className="text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </button>

        <div className="flex items-center md:hidden">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <div className="text-right">
            <p
              className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.streak} day streak
            </p>
          </div>
          <Avatar src={user.avatar} alt={user.name} />
        </div>
      </div>
    </header>
  );
};

export default Header;
