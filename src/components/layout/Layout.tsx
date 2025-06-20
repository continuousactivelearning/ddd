import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ease-in-out ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-white via-indigo-50 to-white text-gray-900'
      }`}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden shadow-inner md:shadow-none">
        <Header />

        <main
          className={`flex-1 overflow-y-auto md:p-6 p-4 transition-all duration-300 ease-in-out ${
            darkMode
              ? 'bg-gray-900 text-gray-100'
              : 'bg-white text-gray-900 shadow-md'
          } rounded-tl-3xl`}
        >
          <div
            className={`max-w-7xl mx-auto rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-4 md:p-6 shadow-md transition-all`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
