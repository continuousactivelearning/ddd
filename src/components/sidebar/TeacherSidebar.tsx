import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/Authcontext';

const TeacherSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      path: '/Dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      description: 'Overview & Analytics'
    },
    {
      path: '/teacher-students',
      name: 'Students',
      icon: Users,
      description: 'Student Management'
    },
    {
      path: '/teacher-assignments',
      name: 'Assignments',
      icon: FileText,
      description: 'Assignment Management'
    },
    {
      path: '/teacher-analytics',
      name: 'Analytics',
      icon: TrendingUp,
      description: 'Performance Analytics'
    },
    {
      path: '/teacher-messages',
      name: 'Messages',
      icon: MessageSquare,
      description: 'Communication Hub'
    },
    {
      path: '/calendar',
      name: 'Calendar',
      icon: Calendar,
      description: 'Schedule & Events'
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: Settings,
      description: 'Account Settings'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`teacher-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          {!isCollapsed && (
            <>
              <BookOpen className="logo-icon" />
              <span className="logo-text">PES Dashboard</span>
            </>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <div className="user-profile">
        <div className="profile-avatar">
          <User className="avatar-icon" />
        </div>
        {!isCollapsed && (
          <div className="profile-info">
            <h4>{user?.name || 'Teacher'}</h4>
            <p className="role-badge">Teacher</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className="nav-icon" />
                  {!isCollapsed && (
                    <div className="nav-content">
                      <span className="nav-name">{item.name}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="logout-icon" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <style >{`
        .teacher-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 230px;
          background: black;
          color: white;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          z-index: 1000;
        }

        .teacher-sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          color: #fbbf24;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .collapse-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-avatar {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-icon {
          width: 24px;
          height: 24px;
        }

        .profile-info h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .role-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin: 4px 0 0 0;
          display: inline-block;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin: 8px 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.2s;
          border-radius: 0 25px 25px 0;
          margin-right: 20px;
          position: relative;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-link.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: #fbbf24;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .nav-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-name {
          font-size: 14px;
          font-weight: 500;
        }

        .nav-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .logout-icon {
          width: 18px;
          height: 18px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .teacher-sidebar {
            width: 100%;
            transform: translateX(-100%);
          }
          
          .teacher-sidebar.collapsed {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherSidebar;