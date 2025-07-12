import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Settings,
  AlertTriangle,
  DollarSign,
  Server,
  Activity,
  Bell,
  Search,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

// Sample data based on the provided structure
const dashboardData = {
  totalUsers: 1247,
  activeUsers: 892,
  totalCourses: 156,
  totalRevenue: 89540,
  monthlyGrowth: '+12.5%',
  serverUptime: '99.9%',
  systemLoad: '67%',
  storageUsed: '78%',
};

const systemMetrics = [
  {
    id: 1,
    name: 'Server Uptime',
    value: '99.9%',
    status: 'normal',
    lastUpdated: '2 min ago',
    description: 'Primary server cluster availability',
  },
  {
    id: 2,
    name: 'Database Performance',
    value: '85ms',
    status: 'normal',
    lastUpdated: '1 min ago',
    description: 'Average query response time',
  },
  {
    id: 3,
    name: 'API Response Time',
    value: '120ms',
    status: 'warning',
    lastUpdated: '3 min ago',
    description: 'REST API endpoint response time',
  },
  {
    id: 4,
    name: 'Active Sessions',
    value: '1,247',
    status: 'normal',
    lastUpdated: '1 min ago',
    description: 'Currently active user sessions',
  },
  {
    id: 5,
    name: 'Storage Usage',
    value: '78%',
    status: 'warning',
    lastUpdated: '5 min ago',
    description: 'Total storage capacity used',
  },
  {
    id: 6,
    name: 'Memory Usage',
    value: '67%',
    status: 'normal',
    lastUpdated: '2 min ago',
    description: 'System memory utilization',
  },
];

const users = [
  {
    id: 1,
    name: 'Dr. Sakshi Sharma',
    email: 'sakshisharma@gmail.com',
    role: 'teacher',
    status: 'active',
    lastLogin: '2 hours ago',
    joinDate: '2024-01-15',
    department: 'Mathematics',
    phone: '+91 98765 43210',
  },
  {
    id: 2,
    name: 'Anshika Sharma',
    email: 'anshika@student.edu',
    role: 'student',
    status: 'active',
    lastLogin: '30 min ago',
    joinDate: '2024-09-01',
    department: 'Computer Science',
    phone: '+91 98765 43211',
  },
  {
    id: 3,
    name: 'Prof. Kumar',
    email: 'kumar@school.edu',
    role: 'teacher',
    status: 'inactive',
    lastLogin: '2 days ago',
    joinDate: '2023-08-20',
    department: 'Physics',
    phone: '+91 98765 43212',
  },
  {
    id: 4,
    name: 'Rajesh Patel',
    email: 'rajesh@student.edu',
    role: 'student',
    status: 'suspended',
    lastLogin: '1 week ago',
    joinDate: '2024-09-01',
    department: 'Chemistry',
    phone: '+91 98765 43213',
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Dr. Sakshi Sharma',
    action: 'Created new course',
    type: 'course',
    time: '1 hour ago',
    details: 'Advanced Mathematics - Calculus II',
  },
  {
    id: 2,
    user: 'System',
    action: 'Backup completed',
    type: 'system',
    time: '2 hours ago',
    details: 'Daily database backup successful',
  },
  {
    id: 3,
    user: 'Admin',
    action: 'User permissions updated',
    type: 'user',
    time: '3 hours ago',
    details: 'Modified teacher access levels',
  },
  {
    id: 4,
    user: 'Payment Gateway',
    action: 'Transaction processed',
    type: 'payment',
    time: '8 hours ago',
    details: 'Student fee payment - $299',
  },
];

const systemAlerts = [
  {
    id: 1,
    title: 'High Memory Usage',
    message: 'System memory usage has exceeded 85% threshold',
    severity: 'medium',
    timestamp: '2024-07-09 10:30:00',
    resolved: false,
  },
  {
    id: 2,
    title: 'Failed Login Attempts',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100',
    severity: 'high',
    timestamp: '2024-07-09 09:15:00',
    resolved: true,
  },
  {
    id: 3,
    title: 'SSL Certificate Expiry',
    message: 'SSL certificate will expire in 30 days',
    severity: 'medium',
    timestamp: '2024-07-09 07:45:00',
    resolved: false,
  },
];

const analyticsData = [
  { month: 'Jan', users: 450, sessions: 2800, revenue: 12500, courses: 45, assignments: 120 },
  { month: 'Feb', users: 520, sessions: 3200, revenue: 14200, courses: 52, assignments: 140 },
  { month: 'Mar', users: 480, sessions: 2900, revenue: 13800, courses: 48, assignments: 135 },
  { month: 'Apr', users: 600, sessions: 3800, revenue: 16500, courses: 58, assignments: 160 },
  { month: 'May', users: 680, sessions: 4200, revenue: 18900, courses: 65, assignments: 180 },
  { month: 'Jun', users: 750, sessions: 4800, revenue: 21200, courses: 72, assignments: 200 },
];

// Prop types for DashboardCard
interface DashboardCardProps {
  title: string;
  icon: React.ElementType;
  value: string;
  change?: string;
  color?: string;
}

// Dashboard Card Component
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, value, change, color = 'blue' }) => (
    <div
        style={{
            backgroundColor: '#fff',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '1.5rem',
            borderLeft: `4px solid ${
                color === 'blue'
                    ? '#3b82f6'
                    : color === 'green'
                    ? '#22c55e'
                    : color === 'purple'
                    ? '#a855f7'
                    : color === 'yellow'
                    ? '#eab308'
                    : '#3b82f6'
            }`, // Dynamic border color
            transition: 'box-shadow 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)')}
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)')}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>{title}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '0.25rem' }}>{value}</p>
                {change && (
                    <p
                        style={{
                            fontSize: '0.875rem',
                            marginTop: '0.25rem',
                            color: change.startsWith('+') ? '#16a34a' : '#dc2626',
                        }}
                    >
                        {change}
                    </p>
                )}
            </div>
            <div
                style={{
                    padding: '0.75rem',
                    borderRadius: '9999px',
                    backgroundColor:
                        color === 'blue'
                            ? '#eff6ff'
                            : color === 'green'
                            ? '#f0fdf4'
                            : color === 'purple'
                            ? '#f3e8ff'
                            : color === 'yellow'
                            ? '#fefce8'
                            : '#eff6ff',
                }}
            >
                <Icon
                    style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        color:
                            color === 'blue'
                                ? '#2563eb'
                                : color === 'green'
                                ? '#16a34a'
                                : color === 'purple'
                                ? '#a855f7'
                                : color === 'yellow'
                                ? '#eab308'
                                : '#2563eb',
                    }}
                />
            </div>
        </div>
    </div>
);

// System Metrics Component
const SystemMetrics: React.FC = () => {
  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#16a34a';
      case 'warning':
        return '#d97706';
      case 'critical':
        return '#dc2626';
      default:
        return '#4b5563';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: '#d97706' }} />;
      case 'critical':
        return <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />;
      default:
        return <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#4b5563' }} />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>System Metrics</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}
      >
        {systemMetrics.map((metric) => (
          <div
            key={metric.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              transition: 'box-shadow 0.2s ease-in-out',
            }}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)')}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: 500, color: '#111827' }}>{metric.name}</h4>
              {getStatusIcon(metric.status)}
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: getMetricStatusColor(metric.status) }}>{metric.value}</p>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>{metric.description}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Updated {metric.lastUpdated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// User Management Component
const UserManagement: React.FC = () => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#f3e8ff', color: '#6b21a8' };
      case 'teacher':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'student':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'inactive':
        return { backgroundColor: '#fef3c7', color: '#a16207' };
      case 'suspended':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>User Management</h3>
        <button
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          <UserPlus style={{ width: '1rem', height: '1rem' }} />
          <span>Add User</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: '#111827' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: '#111827' }}>Email</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: '#111827' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: '#111827' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: '#111827' }}>Last Login</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: '#111827' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  transition: 'background-color 0.2s ease-in-out',
                  borderBottom: index === users.length - 1 ? 'none' : '1px solid #e5e7eb', // Apply border to all but the last row
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827' }}>{user.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{user.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      ...getRoleColor(user.role),
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      ...getStatusColor(user.status),
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{user.lastLogin}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer' }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                      onMouseOut={(e) => (e.currentTarget.style.color = '#2563eb')}
                    >
                      <Eye style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    <button
                      style={{ color: '#16a34a', border: 'none', background: 'none', cursor: 'pointer' }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#147c3e')}
                      onMouseOut={(e) => (e.currentTarget.style.color = '#16a34a')}
                    >
                      <Edit style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    <button
                      style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#b91c1c')}
                      onMouseOut={(e) => (e.currentTarget.style.color = '#dc2626')}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// System Alerts Component
const SystemAlerts: React.FC = () => {
  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'medium':
        return { backgroundColor: '#fef3c7', color: '#a16207' };
      case 'high':
        return { backgroundColor: '#ffedd5', color: '#c2410c' };
      case 'critical':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>System Alerts</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {systemAlerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              borderLeft: `4px solid ${alert.resolved ? '#22c55e' : '#ef4444'}`,
              backgroundColor: alert.resolved ? '#f0fdf4' : '#fef2f2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontWeight: 500, color: '#111827' }}>{alert.title}</h4>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      ...getAlertSeverityColor(alert.severity),
                    }}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>{alert.message}</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{alert.timestamp}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {alert.resolved ? (
                  <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
                ) : (
                  <button
                    style={{
                      fontSize: '0.875rem',
                      color: '#2563eb',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease-in-out',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#2563eb')}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Activities Component
const RecentActivities: React.FC = () => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course':
        return '#3b82f6';
      case 'system':
        return '#6b7280';
      case 'user':
        return '#9333ea';
      case 'achievement':
        return '#eab308';
      case 'security':
        return '#ef4444';
      case 'payment':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Recent Activities</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recentActivities.map((activity) => (
          <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: getActivityColor(activity.type) }}></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{activity.user}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{activity.action}</p>
              {activity.details && <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{activity.details}</p>}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Chart Component
const AnalyticsChart: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Platform Analytics</h3>
      <div style={{ height: '16rem', display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
        {analyticsData.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem 0.25rem 0 0',
                transition: 'all 0.3s ease-in-out',
                height: `${(item.users / 1000) * 200}px`,
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            ></div>
            <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.5rem' }}>{item.month}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#111827' }}>{item.users}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ minHeight: '100vh !important', minWidth: '100vw', backgroundColor: 'transparent', paddingLeft: '210px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#fff', 
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Admin Dashboard</h1>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Welcome back, Admin</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                style={{
                  padding: '0.5rem',
                  color: '#4b5563',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease-in-out',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#111827')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                <Search style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
              <button
                style={{
                  padding: '0.5rem',
                  color: '#4b5563',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s ease-in-out',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#111827')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-0.25rem',
                    right: '-0.25rem',
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#ef4444',
                    borderRadius: '9999px',
                  }}
                ></span>
              </button>
              <button
                style={{
                  padding: '0.5rem',
                  color: '#4b5563',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease-in-out',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#111827')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#4b5563')}
              >
                <Settings style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'courses', label: 'Courses', icon: BookOpen },
              { key: 'system', label: 'System', icon: Server },
              { key: 'security', label: 'Security', icon: Shield },
              { key: 'revenue', label: 'Revenue', icon: DollarSign },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 0.25rem',
                  borderBottom: `2px solid ${activeTab === key ? '#3b82f6' : 'transparent'}`,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  color: activeTab === key ? '#2563eb' : '#6b7280',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== key) {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== key) {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon style={{ width: '1rem', height: '1rem' }} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <DashboardCard
                title="Total Users"
                icon={Users}
                value={dashboardData.totalUsers.toLocaleString()}
                change={dashboardData.monthlyGrowth}
                color="blue"
              />
              <DashboardCard title="Active Users" icon={Activity} value={dashboardData.activeUsers.toLocaleString()} change="+8.2% this week" color="green" />
              <DashboardCard title="Total Courses" icon={BookOpen} value={dashboardData.totalCourses.toString()} change="+5 this month" color="purple" />
              <DashboardCard
                title="Revenue"
                icon={DollarSign}
                value={`$${dashboardData.totalRevenue.toLocaleString()}`}
                change="+15.3% this month"
                color="yellow"
              />
            </div>

            {/* System Metrics */}
            <SystemMetrics />

            {/* Charts and Activity */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <AnalyticsChart />
              <RecentActivities />
            </div>

            {/* System Alerts */}
            <SystemAlerts />
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <UserManagement />
          </div>
        )}

        {activeTab === 'courses' && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Course Management</h2>
            <p style={{ color: '#4b5563' }}>Course management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SystemMetrics />
            <SystemAlerts />
          </div>
        )}

        {activeTab === 'security' && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Security Dashboard</h2>
            <p style={{ color: '#4b5563' }}>Security monitoring interface coming soon...</p>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Revenue Analytics</h2>
            <p style={{ color: '#4b5563' }}>Revenue analytics interface coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;