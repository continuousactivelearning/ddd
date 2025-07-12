import { useState } from 'react';
import { 
  Flame, 
  Users, 
  BarChart3, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Star,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

// Types
interface DashboardCardProps {
  title: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  value: string;
  change?: string;
  color?: string;
}

// Dashboard Card Component
const DashboardCard = ({ title, icon: Icon, value, change, color = "green" }: DashboardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorMap = {
    green: { bg: '#f0f9ff', icon: '#059669', border: '#10b981' },
    blue: { bg: '#eff6ff', icon: '#3b82f6', border: '#3b82f6' },
    yellow: { bg: '#fffbeb', icon: '#f59e0b', border: '#f59e0b' },
    red: { bg: '#fef2f2', icon: '#ef4444', border: '#ef4444' }
  };

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.green;

  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        borderLeft: `4px solid ${colors.border}`,
        transition: 'box-shadow 0.2s ease-in-out',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginTop: '4px', marginBottom: 0 }}>{value}</p>
          {change && (
            <p style={{ 
              fontSize: '14px', 
              marginTop: '4px', 
              marginBottom: 0,
              color: change.startsWith('+') ? '#059669' : '#dc2626'
            }}>
              {change}
            </p>
          )}
        </div>
        <div style={{
          padding: '12px',
          borderRadius: '50%',
          backgroundColor: colors.bg
        }}>
          <Icon style={{ width: '24px', height: '24px', color: colors.icon }} />
        </div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { id: 1, student: "Anshika Shukla", action: "Completed assignment", subject: "Data Structures and Algorithms", time: "2 hours ago" },
    { id: 2, student: "Gaurpad Shukla", action: "Submitted peer review", subject: "MERN Stack Development", time: "3 hours ago" },
    { id: 3, student: "Yogesh Tharwani", action: "Achieved milestone", subject: "SQL and Analytics", time: "5 hours ago" },
    { id: 4, student: "Jhalak", action: "Started new module", subject: "Cloud Practitioner and Architect", time: "6 hours ago" },
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '24px'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', marginTop: 0 }}>Recent Activity</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }}></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{activity.student}</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{activity.action} in {activity.subject}</p>
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Chart Component
const PerformanceChart = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  const data = [
    { month: 'Jan', performance: 75 },
    { month: 'Feb', performance: 82 },
    { month: 'Mar', performance: 78 },
    { month: 'Apr', performance: 85 },
    { month: 'May', performance: 88 },
    { month: 'Jun', performance: 92 },
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '24px'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', marginTop: 0 }}>Class Performance Trend</h3>
      <div style={{ height: '256px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{
                width: '100%',
                backgroundColor: hoveredBar === index ? '#059669' : '#10b981',
                borderRadius: '4px 4px 0 0',
                height: `${(item.performance / 100) * 200}px`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            ></div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', marginBottom: '2px' }}>{item.month}</p>
            <p style={{ fontSize: '12px', fontWeight: '500', color: '#111827', margin: 0 }}>{item.performance}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Top Performers Component
const TopPerformers = () => {
  const topStudents = [
    { name: "Anshika Shukla", score: 95, xp: 2150, streak: 16 },
    { name: "Gaurpad Shukla", score: 92, xp: 2080, streak: 12 },
    { name: "Yogesh Tharwani", score: 89, xp: 1950, streak: 8 },
    { name: "Jhalak", score: 87, xp: 1890, streak: 15 },
  ];

  const [hoveredButton, setHoveredButton] = useState(false);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Top Performers</h3>
        <button 
          style={{
            color: hoveredButton ? '#047857' : '#059669',
            fontSize: '14px',
            fontWeight: '500',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
        >
          View All
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {topStudents.map((student, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '14px' }}>{index + 1}</span>
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{student.name}</p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{student.xp} XP</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star style={{ width: '16px', height: '16px', color: '#eab308', fill: '#eab308' }} />
                <span style={{ fontWeight: '500' }}>{student.score}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                <Flame style={{ width: '12px', height: '12px', color: '#ea580c' }} />
                <span>{student.streak} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Types for Assignment Management
interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  submissions: number;
  total: number;
  status: 'active' | 'completed' | 'draft';
}

// Assignment Management Component
const AssignmentManagement = () => {
  const [assignments] = useState<Assignment[]>([
    { id: 1, title: "DSA Quiz", subject: "Data Structures and Algorithms", dueDate: "2025-07-15", submissions: 28, total: 32, status: "active" },
    { id: 2, title: "MERN Stack Project", subject: "MERN Stack Development", dueDate: "2025-07-20", submissions: 15, total: 32, status: "active" },
    { id: 3, title: "SQL Queries", subject: "SQL and Analytics", dueDate: "2025-07-12", submissions: 32, total: 32, status: "completed" },
    { id: 4, title: "Cloud Research", subject: "Cloud Practitioner and Architect", dueDate: "2025-07-25", submissions: 8, total: 32, status: "draft" },
  ]);

  const [hoveredNewButton, setHoveredNewButton] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getStatusStyle = (status: Assignment['status']) => {
    switch (status) {
      case 'active': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'completed': return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
      case 'draft': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Assignment Management</h3>
        <button 
          style={{
            backgroundColor: hoveredNewButton ? '#047857' : '#059669',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={() => setHoveredNewButton(true)}
          onMouseLeave={() => setHoveredNewButton(false)}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          <span>New Assignment</span>
        </button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#111827' }}>Title</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#111827' }}>Subject</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#111827' }}>Due Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#111827' }}>Submissions</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#111827' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#111827' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr 
                key={assignment.id} 
                style={{
                  backgroundColor: hoveredRow === assignment.id ? '#f9fafb' : '#ffffff',
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={() => setHoveredRow(assignment.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>{assignment.title}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{assignment.subject}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{assignment.dueDate}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{assignment.submissions}/{assignment.total}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    ...getStatusStyle(assignment.status),
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {assignment.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <Eye style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <Edit style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 style={{ width: '16px', height: '16px' }} />
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

// Main Teacher Dashboard Component
const TeacherDashboardOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  // Sample data - replace with real data
  const dashboardData = {
    averageWorkTime: '4.2 hrs/day',
    highestStreakStudent: 'Anshika Shukla (32 days)',
    totalXP: '6,500 XP',
    activeStudents: 32,
    totalAssignments: 24,
    avgClassScore: '87%',
    completionRate: '94%',
    totalClasses: 8
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'students', label: 'Students', icon: Users },
    { key: 'assignments', label: 'Assignments', icon: FileText },
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'transparent', paddingLeft: '230px' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: 'none', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Teacher Dashboard</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Welcome back, Prof. Sharma</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ padding: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Search style={{ width: '20px', height: '20px' }} />
              </button>
              <button style={{ padding: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                <Bell style={{ width: '20px', height: '20px' }} />
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%'
                }}></span>
              </button>
              <button style={{ padding: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Settings style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 'none', margin: '0 auto', padding: '0 16px' }}>
          <nav style={{ display: 'flex', gap: '32px' }}>
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                onMouseEnter={() => setHoveredTab(key)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 4px',
                  borderBottom: activeTab === key ? '2px solid #10b981' : '2px solid transparent',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: activeTab === key ? '#059669' : (hoveredTab === key ? '#374151' : '#6b7280'),
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 'none', margin: '0 auto', padding: '32px 16px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              <DashboardCard 
                title="Active Students" 
                icon={Users} 
                value={dashboardData.activeStudents.toString()} 
                change="+3 this week"
              />
              <DashboardCard 
                title="Avg. Class Score" 
                icon={Award} 
                value={dashboardData.avgClassScore} 
                change="+2.3% this month"
              />
              <DashboardCard 
                title="Completion Rate" 
                icon={TrendingUp} 
                value={dashboardData.completionRate} 
                change="+1.2% this week"
              />
              <DashboardCard 
                title="Total Classes" 
                icon={BookOpen} 
                value={dashboardData.totalClasses.toString()} 
                change="2 scheduled today"
              />
            </div>

            {/* Charts and Activity */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px'
            }}>
              <PerformanceChart />
              <RecentActivity />
            </div>

            {/* Top Performers and Assignment Management */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px'
            }}>
              <AssignmentManagement />
              <TopPerformers />
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Student Management</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Student management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AssignmentManagement />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Analytics Dashboard</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Detailed analytics coming soon...</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Messages</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Message center coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardOverview;