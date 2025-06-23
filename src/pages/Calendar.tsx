import { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'

  const courses = [
    { name: "Data Structures and Algorithms", progress: 75, instructor: "Dr. C Pandurangan", nextClass: "Tomorrow 10:00 AM", assignments: 3 },
    { name: "MERN Stack Development", progress: 40, instructor: "Prof. Sakshi Sharma", nextClass: "Today 2:00 PM", assignments: 2 },
    { name: "SQL and Analytics", progress: 60, instructor: "Dr. Sudarshan Iyengar", nextClass: "Friday 11:00 AM", assignments: 1 },
    { name: "Cloud Practitioner and Architect", progress: 25, instructor: "Prof. Sudarshan Iyengar", nextClass: "Monday 9:00 AM", assignments: 4 },
  ];

  const events = [
    {
      id: 1,
      title: "Data Structures Quiz",
      date: "2024-06-22",
      time: "10:00 AM",
      type: "quiz",
      course: "Data Structures and Algorithms",
      duration: "1 hour",
      instructor: "Dr. C Pandurangan"
    },
    {
      id: 2,
      title: "MERN Stack Lecture",
      date: "2024-06-22",
      time: "2:00 PM",
      type: "lecture",
      course: "MERN Stack Development",
      duration: "1.5 hours",
      instructor: "Prof. Sakshi Sharma"
    },
    {
      id: 3,
      title: "SQL Assignment Due",
      date: "2024-06-25",
      time: "11:59 PM",
      type: "assignment",
      course: "SQL and Analytics",
      duration: "Due",
      instructor: "Dr. Sudarshan Iyengar"
    },
    {
      id: 4,
      title: "Cloud Architecture Workshop",
      date: "2024-06-26",
      time: "9:00 AM",
      type: "workshop",
      course: "Cloud Practitioner and Architect",
      duration: "3 hours",
      instructor: "Prof. Sudarshan Iyengar"
    },
    {
      id: 5,
      title: "Data Structures Project Review",
      date: "2024-06-28",
      time: "3:00 PM",
      type: "review",
      course: "Data Structures and Algorithms",
      duration: "2 hours",
      instructor: "Dr. C Pandurangan"
    },
    {
      id: 6,
      title: "MERN Stack Lab Session",
      date: "2024-06-27",
      time: "10:00 AM",
      type: "lab",
      course: "MERN Stack Development",
      duration: "2 hours",
      instructor: "Prof. Sakshi Sharma"
    },
    {
      id: 7,
      title: "SQL Analytics Workshop",
      date: "2024-06-29",
      time: "11:00 AM",
      type: "workshop",
      course: "SQL and Analytics",
      duration: "2.5 hours",
      instructor: "Dr. Sudarshan Iyengar"
    },
    {
      id: 8,
      title: "Cloud Practitioner Exam",
      date: "2024-06-30",
      time: "9:00 AM",
      type: "exam",
      course: "Cloud Practitioner and Architect",
      duration: "2 hours",
      instructor: "Prof. Sudarshan Iyengar"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "quiz": return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" };
      case "lecture": return { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" };
      case "assignment": return { bg: "#fecaca", text: "#991b1b", border: "#ef4444" };
      case "workshop": return { bg: "#d1fae5", text: "#065f46", border: "#10b981" };
      case "review": return { bg: "#f3e8ff", text: "#6b21a8", border: "#8b5cf6" };
      case "lab": return { bg: "#fef7ff", text: "#a21caf", border: "#d946ef" };
      case "exam": return { bg: "#fee2e2", text: "#dc2626", border: "#f87171" };
      default: return { bg: "#f1f5f9", text: "#475569", border: "#64748b" };
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "quiz": return "📝";
      case "lecture": return "🎓";
      case "assignment": return "📋";
      case "workshop": return "🛠️";
      case "review": return "👥";
      case "lab": return "💻";
      case "exam": return "🎯";
      default: return "📅";
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(dateString);
    return tomorrow.toDateString() === eventDate.toDateString();
  };

  const getDateLabel = (dateString: string) => {
    if (isToday(dateString)) return "Today";
    if (isTomorrow(dateString)) return "Tomorrow";
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayEvents = events.filter(event => isToday(event.date));
  const thisWeekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekFromToday = new Date();
    weekFromToday.setDate(today.getDate() + 7);
    return eventDate >= today && eventDate <= weekFromToday;
  });

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Header with weekdays
    const headerRow = weekdays.map(day => (
      <div key={day} style={{
        padding: '12px',
        textAlign: 'center',
        fontWeight: '600',
        color: '#64748b',
        fontSize: '14px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0'
      }}>
        {day}
      </div>
    ));

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{
          minHeight: '100px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#f9fafb'
        }} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isCurrentDay = new Date().getDate() === day && 
                          new Date().getMonth() === currentDate.getMonth() && 
                          new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div key={day} style={{
          minHeight: '100px',
          border: '1px solid #e2e8f0',
          backgroundColor: isCurrentDay ? '#eff6ff' : 'white',
          padding: '8px',
          position: 'relative'
        }}>
          <div style={{
            fontWeight: isCurrentDay ? '700' : '600',
            color: isCurrentDay ? '#2563eb' : '#1e293b',
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            {day}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            {dayEvents.slice(0, 3).map(event => {
              const colors = getEventTypeColor(event.type);
              return (
                <div key={event.id} style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${colors.border}`
                }}>
                  {getEventTypeIcon(event.type)} {event.title}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div style={{
                fontSize: '10px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        {headerRow}
        {days}
      </div>
    );
  };

  return (
    <div style={{
      padding: "32px",
      paddingLeft: "230px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 8px 0"
          }}>📅 Academic Calendar</h1>
          <p style={{
            color: "#64748b",
            fontSize: "16px",
            margin: "0"
          }}>Your courses, lectures, and deadlines</p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setViewMode(viewMode === 'month' ? 'list' : 'month')}
            style={{
              padding: '8px 16px',
              backgroundColor: viewMode === 'month' ? '#3b82f6' : 'white',
              color: viewMode === 'month' ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {viewMode === 'month' ? '📊 List View' : '📅 Calendar View'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "32px"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{
            color: "#3b82f6",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0"
          }}>{todayEvents.length}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Events Today</p>
        </div>
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{
            color: "#10b981",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0"
          }}>{thisWeekEvents.length}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>This Week</p>
        </div>
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{
            color: "#f59e0b",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0"
          }}>{courses.length}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Active Courses</p>
        </div>
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{
            color: "#ef4444",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0"
          }}>{courses.reduce((sum, course) => sum + course.assignments, 0)}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Pending Assignments</p>
        </div>
      </div>

      {viewMode === 'month' ? (
        <>
          {/* Calendar Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => navigateMonth(-1)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(1)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          {renderCalendarGrid()}
        </>
      ) : (
        <>
          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                🌟 Today's Events
              </h2>
              <div style={{
                display: "grid",
                gap: "12px"
              }}>
                {todayEvents.map((event) => {
                  const colors = getEventTypeColor(event.type);
                  return (
                    <div
                      key={event.id}
                      style={{
                        backgroundColor: "white",
                        border: `2px solid ${colors.border}`,
                        borderRadius: "12px",
                        padding: "16px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}>
                          <span style={{ fontSize: "24px" }}>{getEventTypeIcon(event.type)}</span>
                          <div>
                            <h4 style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#1e293b",
                              margin: "0 0 2px 0"
                            }}>{event.title}</h4>
                            <p style={{
                              fontSize: "14px",
                              color: "#64748b",
                              margin: "0 0 2px 0"
                            }}>{event.course}</p>
                            <p style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              margin: "0"
                            }}>{event.instructor}</p>
                          </div>
                        </div>
                        <div style={{
                          textAlign: "right"
                        }}>
                          <p style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: colors.text,
                            margin: "0 0 2px 0"
                          }}>{event.time}</p>
                          <p style={{
                            fontSize: "12px",
                            color: "#64748b",
                            margin: "0"
                          }}>{event.duration}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "16px"
            }}>Upcoming Events</h2>
            
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
              overflow: "hidden"
            }}>
              {upcomingEvents.map((event, index) => {
                const colors = getEventTypeColor(event.type);
                const isLast = index === upcomingEvents.length - 1;
                
                return (
                  <div
                    key={event.id}
                    style={{
                      padding: "20px 24px",
                      borderBottom: !isLast ? "1px solid #f1f5f9" : "none"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flex: "1"
                      }}>
                        <div style={{
                          fontSize: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "48px",
                          height: "48px",
                          backgroundColor: colors.bg,
                          borderRadius: "12px"
                        }}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        
                        <div style={{ flex: "1" }}>
                          <h4 style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#1e293b",
                            margin: "0 0 4px 0"
                          }}>{event.title}</h4>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap"
                          }}>
                            <span style={{
                              fontSize: "14px",
                              color: "#64748b"
                            }}>{event.course}</span>
                            <span style={{
                              fontSize: "12px",
                              color: "#94a3b8"
                            }}>•</span>
                            <span style={{
                              fontSize: "14px",
                              color: "#64748b"
                            }}>{event.duration}</span>
                            <span style={{
                              fontSize: "12px",
                              color: "#94a3b8"
                            }}>•</span>
                            <span style={{
                              fontSize: "12px",
                              color: "#94a3b8"
                            }}>{event.instructor}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        textAlign: "right"
                      }}>
                        <div style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          padding: "4px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          marginBottom: "4px"
                        }}>
                          {getDateLabel(event.date)}
                        </div>
                        <p style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: "0 0 2px 0"
                        }}>{event.time}</p>
                        <p style={{
                          fontSize: "12px",
                          color: "#64748b",
                          margin: "0"
                        }}>{formatDate(event.date)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;