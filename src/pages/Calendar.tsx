import  { useState } from "react";

const Calendar = () => {
  const [] = useState(new Date());
  const [] = useState(new Date());

  const events = [
    {
      id: 1,
      title: "Data Structures Quiz",
      date: "2024-06-22",
      time: "10:00 AM",
      type: "quiz",
      course: "Data Structures",
      duration: "1 hour"
    },
    {
      id: 2,
      title: "Web Development Lecture",
      date: "2024-06-22",
      time: "2:00 PM",
      type: "lecture",
      course: "Web Development",
      duration: "1.5 hours"
    },
    {
      id: 3,
      title: "SQL Assignment Due",
      date: "2024-06-25",
      time: "11:59 PM",
      type: "assignment",
      course: "SQL Mastery",
      duration: "Due"
    },
    {
      id: 4,
      title: "Cloud Architecture Workshop",
      date: "2024-06-26",
      time: "9:00 AM",
      type: "workshop",
      course: "Cloud Basics",
      duration: "3 hours"
    },
    {
      id: 5,
      title: "Data Analytics Project Review",
      date: "2024-06-28",
      time: "3:00 PM",
      type: "review",
      course: "Data Analytics",
      duration: "2 hours"
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "quiz": return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" };
      case "lecture": return { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" };
      case "assignment": return { bg: "#fecaca", text: "#991b1b", border: "#ef4444" };
      case "workshop": return { bg: "#d1fae5", text: "#065f46", border: "#10b981" };
      case "review": return { bg: "#f3e8ff", text: "#6b21a8", border: "#8b5cf6" };
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
      default: return "📅";
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
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
    return getDayName(dateString);
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

  return (
    <div style={{
      padding: "32px",
      paddingLeft: "230px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        marginBottom: "32px"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#1e293b",
          margin: "0 0 8px 0"
        }}>📅 Calendar</h1>
        <p style={{
          color: "#64748b",
          fontSize: "16px",
          margin: "0"
        }}>Your upcoming lectures, quizzes, and deadlines</p>
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
          }}>{upcomingEvents.length}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Upcoming Events</p>
        </div>
      </div>

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
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
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
                          margin: "0"
                        }}>{event.course}</p>
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
                  borderBottom: !isLast ? "1px solid #f1f5f9" : "none",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
    </div>
  );
};

export default Calendar;