import React, { useState } from 'react';
import { getUserDataById } from '../../data/SampleUserData'; // adjust import path as needed

interface BadgesProps {
  userId: string;
}

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

const Badges: React.FC<BadgesProps> = ({ userId }) => {
  const user = getUserDataById(userId);
  if (!user) return null;

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadgeNames = user.badges;

  // Dynamic base badges (add your styling info per badge)
  const baseBadges: Omit<Badge, 'isEarned'>[] = [
    {
      name: 'Early Bird',
      icon: '⛰️',
      gradient: 'linear-gradient(135deg, #ea580c, #dc2626)',
      shadowColor: 'rgba(234, 88, 12, 0.4)',
      description: 'Complete 5 lessons before 9 AM',
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
      earnedDate: '1/18/2024',
      rarity: 'rare',
      checkmark: true
    },
    {
      name: 'Quiz Champion',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #059669, #047857)',
      shadowColor: 'rgba(5, 150, 105, 0.4)',
      description: 'Score 100% on 10 quizzes',
      earnedDate: '1/20/2024',
      rarity: 'epic',
      checkmark: true
    },
    {
      name: 'Speed Learner',
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      shadowColor: 'rgba(59, 130, 246, 0.4)',
      description: 'Complete 20 lessons in one day',
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
      progress: 2,
      maxProgress: 5,
      progressLabel: '2 of 5 completed',
      rarity: 'common'
    }
  ];

  // Final badge array, marking isEarned from user sample data
const badges: Badge[] = baseBadges.map((badge) => ({
    ...badge,
    isEarned: earnedBadgeNames.includes(badge.name),
  }));


  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const closeModal = () => {
    setSelectedBadge(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#d1d5db';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#d1d5db';
    }
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '100px',
    backgroundColor: 'transparent',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  };

  const headerTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  };

  const headerSubtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0'
  };

  const trophyIconStyle: React.CSSProperties = {
    fontSize: '24px',
    color: '#3b82f6',
    padding: '8px',
    backgroundColor: '#dbeafe',
    borderRadius: '8px'
  };

  const badgesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    maxWidth: '900px'
  };

  const badgeCardStyle = (badge: Badge): React.CSSProperties => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: `2px solid ${getRarityBorder(badge.rarity)}`,
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    opacity: badge.isEarned ? 1 : 0.8
  });

  const rarityLabelStyle = (rarity: string): React.CSSProperties => ({
    position: 'absolute',
    top: '12px',
    left: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: getRarityColor(rarity),
    textTransform: 'lowercase',
    backgroundColor: rarity === 'legendary' ? '#fef3c7' : 'transparent'
  });

  const checkmarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '20px',
    height: '20px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: 'white'
  };

  const badgeContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '12px'
  };

  const badgeIconStyle: React.CSSProperties = {
    fontSize: '40px',
    marginBottom: '12px',
    filter: 'none'
  };

  const badgeNameStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '6px'
  };

  const badgeDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.4'
  };

  const progressSectionStyle: React.CSSProperties = {
    width: '100%',
    marginTop: '16px'
  };

  const progressHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  };

  const progressLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600'
  };

  const progressValueStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#1f2937',
    fontWeight: '600'
  };

  const progressBarContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden'
  };

  const progressBarFillStyle = (progress: number, maxProgress: number): React.CSSProperties => ({
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '3px',
    width: `${(progress / maxProgress) * 100}%`,
    transition: 'width 0.8s ease'
  });

  // Modal styles
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
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

  const earnedCount = badges.filter(badge => badge.isEarned).length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={headerTitleStyle}>Achievements</h1>
          <p style={headerSubtitleStyle}>{earnedCount} of {badges.length} earned</p>
        </div>
        <div style={trophyIconStyle}>🏆</div>
      </div>

      <div style={badgesGridStyle}>
        {badges.map((badge, _index) => (
          <div
            key={badge.name}
            style={badgeCardStyle(badge)}
            onClick={() => handleBadgeClick(badge)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={rarityLabelStyle(badge.rarity)}>{badge.rarity}</div>
            
            {badge.checkmark && (
              <div style={checkmarkStyle}>✓</div>
            )}

            <div style={badgeContentStyle}>
              <div style={badgeIconStyle}>{badge.icon}</div>
              <h3 style={badgeNameStyle}>{badge.name}</h3>
              <p style={badgeDescriptionStyle}>{badge.description}</p>

              {!badge.isEarned && badge.progress !== undefined && (
                <div style={progressSectionStyle}>
                  <div style={progressHeaderStyle}>
                    <span style={progressLabelStyle}>Progress</span>
                    <span style={progressValueStyle}>{badge.progress}/{badge.maxProgress}</span>
                  </div>
                  <div style={progressBarContainerStyle}>
                    <div style={progressBarFillStyle(badge.progress, badge.maxProgress!)}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
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
                      {Math.round((selectedBadge.progress! / selectedBadge.maxProgress!) * 100)}%
                    </span>
                  </div>
                  <div style={modalProgressBarContainerStyle}>
                    <div style={modalProgressBarFillStyle(selectedBadge.progress!, selectedBadge.maxProgress!)}></div>
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

export default Badges;