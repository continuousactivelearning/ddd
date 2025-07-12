import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  BookOpen,
  Shield,
  Settings,
  DollarSign,
  Server,
  Activity,
  Bell,
  Calendar,
  FileText,
  LogOut,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Database,
  UserCheck,
  TrendingUp,
  Monitor,
  Lock,
  CreditCard,
  BookMarked,
  GraduationCap,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/Authcontext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/admin-dashboard',
      subItems: [
        { label: 'Overview', path: '/admin-dashboard', icon: BarChart3 },
        { label: 'Analytics', path: '/admin-dashboard?tab=analytics', icon: TrendingUp },
        { label: 'Reports', path: '/admin-dashboard?tab=reports', icon: FileText },
      ]
    },
    {
      key: 'users',
      label: 'User Management',
      icon: Users,
      subItems: [
        { label: 'All Users', path: '/admin-dashboard?tab=users', icon: Users },
        { label: 'Students', path: '/admin/students', icon: GraduationCap },
        { label: 'Teachers', path: '/admin/teachers', icon: BookMarked },
        { label: 'Admins', path: '/admin/admins', icon: UserCheck },
      ]
    },
    {
      key: 'courses',
      label: 'Course Management',
      icon: BookOpen,
      subItems: [
        { label: 'All Courses', path: '/admin-dashboard?tab=courses', icon: BookOpen },
        { label: 'Categories', path: '/admin/course-categories', icon: FileText },
        { label: 'Assignments', path: '/AssignmentEvaluation', icon: FileText },
      ]
    },
    {
      key: 'system',
      label: 'System',
      icon: Server,
      subItems: [
        { label: 'System Health', path: '/admin-dashboard?tab=system', icon: Monitor },
        { label: 'Server Status', path: '/admin/server-status', icon: Server },
        { label: 'Database', path: '/admin/database', icon: Database },
        { label: 'Alerts', path: '/admin/alerts', icon: AlertTriangle },
      ]
    },
    {
      key: 'security',
      label: 'Security',
      icon: Shield,
      subItems: [
        { label: 'Security Dashboard', path: '/admin-dashboard?tab=security', icon: Shield },
        { label: 'Access Control', path: '/admin/access-control', icon: Lock },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: Activity },
      ]
    },
    {
      key: 'finance',
      label: 'Finance',
      icon: DollarSign,
      subItems: [
        { label: 'Revenue', path: '/admin-dashboard?tab=revenue', icon: DollarSign },
        { label: 'Payments', path: '/admin/payments', icon: CreditCard },
        { label: 'Billing', path: '/admin/billing', icon: FileText },
      ]
    },
    {
      key: 'general',
      label: 'General',
      icon: Settings,
      subItems: [
        { label: 'Calendar', path: '/calendar', icon: Calendar },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin-dashboard') {
      return location.pathname === '/admin-dashboard' && !location.search;
    }
    return location.pathname + location.search === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          {!isCollapsed && (
            <>
              <h2 className="logo-text">Admin Portal</h2>
              <h1 className="logo-subtitle">PES</h1>
            </>
          )}
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.key} className="nav-group">
              <div
                className={`nav-item ${expandedMenus.includes(item.key) ? 'expanded' : ''}`}
                onClick={() => toggleMenu(item.key)}
              >
                <div className="nav-item-content">
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <>
                      <span className="nav-text">{item.label}</span>
                      {expandedMenus.includes(item.key) ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </>
                  )}
                </div>
              </div>
              
              {expandedMenus.includes(item.key) && !isCollapsed && (
                <div className="sub-menu">
                  {item.subItems?.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`sub-nav-item ${isActive(subItem.path) ? 'active' : ''}`}
                    >
                      <subItem.icon size={16} />
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <Users size={20} />
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <p className="user-name">{user?.name || 'Admin'}</p>
              <p className="user-role">Administrator</p>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <style >{`
        .admin-sidebar {
          width: 230px;
          height: 100vh;
          background:white;
          color: black;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }

        .admin-sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0);
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 20px 0;
          color: black;
        }

        .logo-subtitle {
          font-size: 2rem;
          font-weight: 500;
          color: black;
          margin: 0;
          padding-left: 20px;
        }

        .collapse-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: background-color 0.2s;
        }

        .collapse-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-group {
          margin-bottom: 0.5rem;
        }

        .nav-item {
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 0 1rem;
          border-radius: 0.5rem;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0);
        }

        .nav-item.expanded {
          background-color: rgba(255, 255, 255, 0);
        }

        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          width: 100%;
        }

        .nav-text {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .sub-menu {
          margin-left: 1rem;
          margin-top: 0.5rem;
          padding-left: 1rem;
          color:black;
          border-left: 2px solid rgba(255, 255, 255, 0.1);
        }

        .sub-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          margin: 0.25rem 0;
          color: rgba(9, 8, 8, 0.8);
          text-decoration: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .sub-nav-item:hover {
          background-color: rgba(235, 70, 70, 0);
          color: green;
        }

        .sub-nav-item.active {
          background-color: rgba(12, 12, 12, 0);
          color: white;
          font-weight: 600;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: 'transparent';
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-details {
          flex: 1;
          color: black;
        }

        .user-name {
          font-weight: 600;
          margin: 0;
          font-size: 0.875rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: rgba(17, 1, 1, 0.8);
          margin: 0;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.54);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0);
        }

        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0);
          border-radius: 2px;
        }

        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0);
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;