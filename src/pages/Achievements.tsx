const Achievements = () => {
  const achievements = [
    { 
      title: "Quiz Master", 
      icon: "🏆", 
      date: "2024-06-15", 
      type: "epic",
      description: "Complete 10 quizzes with 90%+ score",
      progress: 100,
      points: 500,
      rarity: "Epic"
    },
    { 
      title: "Cloud Explorer", 
      icon: "☁️", 
      date: "2024-06-12", 
      type: "rare",
      description: "Complete all Cloud Basics modules",
      progress: 100,
      points: 300,
      rarity: "Rare"
    },
    { 
      title: "Streak Champion", 
      icon: "🔥", 
      date: "2024-06-05", 
      type: "legendary",
      description: "Maintain 30-day learning streak",
      progress: 100,
      points: 1000,
      rarity: "Legendary"
    },
    { 
      title: "Fast Learner", 
      icon: "⚡", 
      date: "2024-06-03", 
      type: "rare",
      description: "Complete a course in under 2 weeks",
      progress: 100,
      points: 400,
      rarity: "Rare"
    },
    { 
      title: "Discussion Leader", 
      icon: "💬", 
      date: "2024-05-28", 
      type: "epic",
      description: "Start 5 meaningful discussions",
      progress: 100,
      points: 350,
      rarity: "Epic"
    },
    { 
      title: "Assignment Ace", 
      icon: "📝", 
      date: "2024-05-25", 
      type: "rare",
      description: "Submit 20 assignments on time",
      progress: 100,
      points: 250,
      rarity: "Rare"
    },
    { 
      title: "Perfect Score", 
      icon: "⭐", 
      date: "", 
      type: "legendary",
      description: "Score 100% on 5 consecutive quizzes",
      progress: 60,
      points: 750,
      rarity: "Legendary"
    },
    { 
      title: "Knowledge Seeker", 
      icon: "🔍", 
      date: "", 
      type: "epic",
      description: "Watch 50 video lectures",
      progress: 80,
      points: 300,
      rarity: "Epic"
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'legendary': return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
      case 'epic': return { bg: '#f3e8ff', border: '#a855f7', text: '#7c3aed' };
      case 'rare': return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' };
      default: return { bg: '#f1f5f9', border: '#64748b', text: '#475569' };
    }
  };

  const completedAchievements = achievements.filter(a => a.progress === 100);
  const inProgressAchievements = achievements.filter(a => a.progress < 100);
  const totalPoints = completedAchievements.reduce((sum, a) => sum + a.points, 0);

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
        }}>🏆 Achievements</h1>
        <p style={{
          color: "#64748b",
          fontSize: "16px",
          margin: "0"
        }}>Your learning milestones and accomplishments</p>
      </div>

      {/* Stats Overview */}
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
            color: "#f59e0b",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 4px 0"
          }}>{totalPoints}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Total Points Earned</p>
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
          }}>{completedAchievements.length}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>Achievements Unlocked</p>
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
          }}>{inProgressAchievements.length}</h3>
          <p style={{
            color: "#64748b",
            fontSize: "14px",
            margin: "0"
          }}>In Progress</p>
        </div>
      </div>

      {/* Completed Achievements */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#1e293b",
          marginBottom: "16px"
        }}>Completed Achievements</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px"
        }}>
          {completedAchievements.map((achieve, i) => {
            const colors = getTypeColor(achieve.type);
            return (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  border: `2px solid ${colors.border}`,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: colors.bg,
                  color: colors.text,
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {achieve.rarity}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px"
                }}>
                  <div style={{
                    fontSize: "32px",
                    marginRight: "12px",
                    padding: "8px",
                    backgroundColor: colors.bg,
                    borderRadius: "12px"
                  }}>
                    {achieve.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: "0 0 4px 0"
                    }}>{achieve.title}</h4>
                    <p style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "0"
                    }}>{achieve.date}</p>
                  </div>
                </div>

                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "12px",
                  lineHeight: "1.4"
                }}>{achieve.description}</p>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "14px",
                    color: "#10b981",
                    fontWeight: "600"
                  }}>✓ Completed</span>
                  <span style={{
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>+{achieve.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In Progress Achievements */}
      <div>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#1e293b",
          marginBottom: "16px"
        }}>In Progress</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px"
        }}>
          {inProgressAchievements.map((achieve, i) => {
            return (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  border: `2px solid #e2e8f0`,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  opacity: "0.8",
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {achieve.rarity}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px"
                }}>
                  <div style={{
                    fontSize: "32px",
                    marginRight: "12px",
                    padding: "8px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    opacity: "0.6"
                  }}>
                    {achieve.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#64748b",
                      margin: "0 0 4px 0"
                    }}>{achieve.title}</h4>
                    <p style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      margin: "0"
                    }}>In Progress</p>
                  </div>
                </div>

                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "16px",
                  lineHeight: "1.4"
                }}>{achieve.description}</p>

                <div style={{ marginBottom: "12px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <span style={{
                      fontSize: "14px",
                      color: "#64748b",
                      fontWeight: "500"
                    }}>Progress</span>
                    <span style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#3b82f6"
                    }}>{achieve.progress}%</span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "#3b82f6",
                        width: `${achieve.progress}%`,
                        borderRadius: "4px",
                        transition: "width 0.3s ease"
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "500"
                  }}>{100 - achieve.progress}% to go</span>
                  <span style={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>+{achieve.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;