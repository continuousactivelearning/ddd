const CourseActivity = () => {
  const activities = [
    { 
      title: "Completed Quiz: Arrays", 
      type: "quiz", 
      timestamp: "2 hours ago", 
      score: "88%",
      course: "Data Structures",
      points: 25,
      status: "completed"
    },
    { 
      title: "Watched Lecture: React Basics", 
      type: "video", 
      timestamp: "1 day ago",
      course: "Web Development",
      duration: "45 min",
      status: "completed"
    },
    { 
      title: "Submitted Assignment: SQL Joins", 
      type: "assignment", 
      timestamp: "2 days ago",
      course: "SQL Mastery",
      status: "pending_review"
    },
    { 
      title: "Started Module: Cloud Architecture", 
      type: "module", 
      timestamp: "3 days ago",
      course: "Cloud Basics",
      progress: 60,
      status: "in_progress"
    },
    { 
      title: "Discussion Forum: Data Visualization", 
      type: "discussion", 
      timestamp: "4 days ago",
      course: "Data Analytics",
      replies: 12,
      status: "active"
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz": return "📝";
      case "video": return "🎥";
      case "assignment": return "📋";
      case "module": return "📚";
      case "discussion": return "💬";
      default: return "📄";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#10b981";
      case "pending_review": return "#f59e0b";
      case "in_progress": return "#3b82f6";
      case "active": return "#8b5cf6";
      default: return "#64748b";
    }
  };


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
        }}>📊 Course Activity</h1>
        <p style={{
          color: "#64748b",
          fontSize: "16px",
          margin: "0"
        }}>Your recent learning activities and progress</p>
      </div>

      {/* Stats Cards */}
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
            color: "#10b981",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0"
          }}>12</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Activities This Week</p>
        </div>
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
          }}>85%</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Average Score</p>
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
          }}>3</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Pending Reviews</p>
        </div>
      </div>

      {/* Activity List */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b",
            margin: "0"
          }}>Recent Activities</h2>
        </div>
        
        <div style={{ padding: "0" }}>
          {activities.map((activity, idx) => (
            <div
              key={idx}
              style={{
                padding: "20px 24px",
                borderBottom: idx < activities.length - 1 ? "1px solid #f1f5f9" : "none",
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
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px"
                  }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div style={{ flex: "1" }}>
                    <h4 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: "0 0 4px 0"
                    }}>{activity.title}</h4>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span style={{
                        fontSize: "14px",
                        color: "#64748b"
                      }}>{activity.course}</span>
                      <span style={{
                        fontSize: "12px",
                        color: "#94a3b8"
                      }}>•</span>
                      <span style={{
                        fontSize: "14px",
                        color: "#64748b"
                      }}>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  {activity.score && (
                    <span style={{
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>{activity.score}</span>
                  )}
                  
                  {activity.points && (
                    <span style={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>+{activity.points} pts</span>
                  )}

                  {activity.duration && (
                    <span style={{
                      backgroundColor: "#e0e7ff",
                      color: "#3730a3",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>{activity.duration}</span>
                  )}

                  {activity.progress && (
                    <span style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>{activity.progress}%</span>
                  )}

                  {activity.replies && (
                    <span style={{
                      backgroundColor: "#f3e8ff",
                      color: "#6b21a8",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>{activity.replies} replies</span>
                  )}

                  <div style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: getStatusColor(activity.status),
                    borderRadius: "50%"
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseActivity;