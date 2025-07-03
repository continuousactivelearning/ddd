import React, { useState } from 'react';

interface Badge {
  name: string;
  icon: string;
  gradient: string;
  shadowColor: string;
  description: string;
  isEarned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedDate?: string;
  progressLabel?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  checkmark?: boolean;
}

const badges: Badge[] = [
  { 
    name: 'Early Bird', 
    icon: '⛰️', 
    gradient: 'linear-gradient(135deg, #ea580c, #dc2626)',
    shadowColor: 'rgba(234, 88, 12, 0.4)',
    description: 'Complete 5 lessons before 9 AM',
    isEarned: true,
    earnedDate: "2025-06-15",
    rarity: 'common',
    checkmark: true
  },
  { 
    name: 'Streak Master', 
    icon: '🔥', 
    gradient: 'linear-gradient(135deg, #dc2626, #991b1b)',
    shadowColor: 'rgba(220, 38, 38, 0.4)',
    description: 'Maintain a 7-day learning streak',
    isEarned: true,
    earnedDate: '2025-01-18',
    rarity: 'rare',
    checkmark: true
  },
  { 
    name: 'Quiz Champion', 
    icon: '🏆', 
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    shadowColor: 'rgba(5, 150, 105, 0.4)',
    description: 'Score 100% on 10 quizzes',
    isEarned: true,
    earnedDate: '2025-01-20',
    rarity: 'epic',
    checkmark: true
  },
  { 
    name: 'Speed Learner', 
    icon: '⚡', 
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    description: 'Complete 20 lessons in one day',
    isEarned: false,
    progress: 13,
    maxProgress: 20,
    progressLabel: '13 of 20 completed',
    rarity: 'rare'
  },
  { 
    name: 'Perfectionist', 
    icon: '⭐', 
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    shadowColor: 'rgba(6, 182, 212, 0.4)',
    description: 'Achieve 100% completion on all modules',
    isEarned: false,
    progress: 10,
    maxProgress: 12,
    progressLabel: '10 of 12 completed',
    rarity: 'legendary'
  },
  { 
    name: 'Social Learner', 
    icon: '👥', 
    gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
    shadowColor: 'rgba(107, 114, 128, 0.4)',
    description: 'Help 5 other students with questions',
    isEarned: false,
    progress: 2,
    maxProgress: 5,
    progressLabel: '2 of 5 completed',
    rarity: 'common'
  },
];

const Achievements: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const closeModal = () => {
    setSelectedBadge(null);
  };

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'common': 
        return { 
          bg: '#f1f5f9', 
          border: '#64748b', 
          text: '#475569',
          points: 100
        };
      case 'rare': 
        return { 
          bg: '#dbeafe', 
          border: '#3b82f6', 
          text: '#1e40af',
          points: 300
        };
      case 'epic': 
        return { 
          bg: '#f3e8ff', 
          border: '#a855f7', 
          text: '#7c3aed',
          points: 500
        };
      case 'legendary': 
        return { 
          bg: '#fef3c7', 
          border: '#f59e0b', 
          text: '#92400e',
          points: 1000
        };
      default: 
        return { 
          bg: '#f1f5f9', 
          border: '#64748b', 
          text: '#475569',
          points: 100
        };
    }
  };

  const completedAchievements = badges.filter(badge => badge.isEarned);
  const inProgressAchievements = badges.filter(badge => !badge.isEarned);
  const totalPoints = completedAchievements.reduce((sum, badge) => sum + getRarityColors(badge.rarity).points, 0);

  // Modal styles
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: selectedBadge ? 1 : 0,
    visibility: selectedBadge ? 'visible' : 'hidden',
    transition: 'all 0.3s ease'
  };

  const modalStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transform: selectedBadge ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative'
  };

  const modalIconStyle: React.CSSProperties = {
    fontSize: '60px',
    marginBottom: '16px',
    display: 'block',
    filter: selectedBadge?.isEarned ? 'none' : 'grayscale(100%)'
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  };

  const modalDescriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.5'
  };

  const earnedBadgeStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    color: '#065f46',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px'
  };

  const modalProgressSectionStyle: React.CSSProperties = {
    marginBottom: '24px'
  };

  const modalProgressHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  };

  const modalProgressLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const modalProgressPercentStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#3b82f6',
    fontWeight: '700'
  };

  const modalProgressBarContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  };

  const modalProgressBarFillStyle = (progress: number, maxProgress: number): React.CSSProperties => ({
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    width: `${(progress / maxProgress) * 100}%`,
    transition: 'width 0.8s ease'
  });

  const modalProgressTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  };

  return (
    <div style={{
      padding: "32px",
      paddingLeft: "230px",
      backgroundColor: "transparent",
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
          {completedAchievements.map((badge, i) => {
            const colors = getRarityColors(badge.rarity);
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
                onClick={() => handleBadgeClick(badge)}
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
                  fontWeight: "600",
                  textTransform: "capitalize"
                }}>
                  {badge.rarity}
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
                    {badge.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: "0 0 4px 0"
                    }}>{badge.name}</h4>
                    <p style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "0"
                    }}>{badge.earnedDate}</p>
                  </div>
                </div>

                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "12px",
                  lineHeight: "1.4"
                }}>{badge.description}</p>

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
                  }}>+{colors.points} pts</span>
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
          {inProgressAchievements.map((badge, i) => {
            const colors = getRarityColors(badge.rarity);
            const progressPercent = badge.progress && badge.maxProgress ? 
              Math.round((badge.progress / badge.maxProgress) * 100) : 0;
            
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
                onClick={() => handleBadgeClick(badge)}
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
                  fontWeight: "600",
                  textTransform: "capitalize"
                }}>
                  {badge.rarity}
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
                    {badge.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#64748b",
                      margin: "0 0 4px 0"
                    }}>{badge.name}</h4>
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
                }}>{badge.description}</p>

                {badge.progress !== undefined && badge.maxProgress !== undefined && (
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
                      }}>{progressPercent}%</span>
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
                          width: `${progressPercent}%`,
                          borderRadius: "4px",
                          transition: "width 0.3s ease"
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "500"
                  }}>{badge.progressLabel || `${100 - progressPercent}% to go`}</span>
                  <span style={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>+{colors.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <div style={modalOverlayStyle} onClick={closeModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {selectedBadge && (
            <>
              <span style={modalIconStyle}>{selectedBadge.icon}</span>
              <h2 style={modalTitleStyle}>{selectedBadge.name}</h2>
              <p style={modalDescriptionStyle}>{selectedBadge.description}</p>
              
              {selectedBadge.isEarned ? (
                <div style={earnedBadgeStyle}>
                  Earned on {selectedBadge.earnedDate}
                </div>
              ) : (
                <div style={modalProgressSectionStyle}>
                  <div style={modalProgressHeaderStyle}>
                    <span style={modalProgressLabelStyle}>Progress</span>
                    <span style={modalProgressPercentStyle}>
                      {selectedBadge.progress && selectedBadge.maxProgress ? 
                        Math.round((selectedBadge.progress / selectedBadge.maxProgress) * 100) : 0}%
                    </span>
                  </div>
                  <div style={modalProgressBarContainerStyle}>
                    <div style={modalProgressBarFillStyle(
                      selectedBadge.progress || 0, 
                      selectedBadge.maxProgress || 1
                    )}></div>
                  </div>
                  <div style={modalProgressTextStyle}>
                    {selectedBadge.progressLabel}
                  </div>
                </div>
              )}
              
              <button 
                style={closeButtonStyle}
                onClick={closeModal}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;