import React, { useState, useEffect } from 'react';

interface Badge {
  name: string;
  icon: string;
  gradient: string;
  shadowColor: string;
  description: string;
}

const badges: Badge[] = [
  { 
    name: 'Newbie', 
    icon: '🌱', 
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    description: 'Welcome to the journey!'
  },
  { 
    name: 'Productivity Pro', 
    icon: '⚡', 
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    description: 'Efficiency master!'
  },
  { 
    name: 'Legend', 
    icon: '👑', 
    gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    shadowColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Ultimate achievement!'
  },
];

const Badges: React.FC = () => {
  const [visibleBadges, setVisibleBadges] = useState<number[]>([]);
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);
  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [sparklePositions, setSparklePositions] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    // Staggered animations
    setTimeout(() => setShowHeader(true), 100);
    
    badges.forEach((_, index) => {
      setTimeout(() => {
        setVisibleBadges(prev => [...prev, index]);
      }, 300 + (index * 250));
    });
    
    setTimeout(() => setShowStats(true), 1200);

    // Generate random sparkle positions
    const positions = Array.from({length: 8}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setSparklePositions(positions);
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    overflow: 'hidden'
  };

  const backgroundEffectStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 30% 40%, 
      rgba(59, 130, 246, 0.05) 0%, 
      transparent 50%),
      radial-gradient(circle at 70% 60%, 
      rgba(245, 158, 11, 0.05) 0%, 
      transparent 50%)`,
    animation: 'float 6s ease-in-out infinite',
    pointerEvents: 'none'
  };

  const sparkleStyle = (index: number): React.CSSProperties => ({
    position: 'absolute',
    left: `${sparklePositions[index]?.x || 0}%`,
    top: `${sparklePositions[index]?.y || 0}%`,
    fontSize: '8px',
    color: '#fbbf24',
    animation: `twinkle 3s ease-in-out infinite ${index * 0.5}s`,
    pointerEvents: 'none',
    opacity: 0
  });

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    transition: 'all 0.8s ease',
    transform: showHeader ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)',
    opacity: showHeader ? 1 : 0
  };

  const trophyStyle: React.CSSProperties = {
    fontSize: '28px',
    animation: showHeader ? 'bounce 2s ease-in-out infinite' : 'none',
    transformOrigin: 'bottom',
    filter: 'drop-shadow(0 4px 8px rgba(251, 191, 36, 0.3))'
  };

  const headerTextStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#e5e7eb',
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  };

  const badgesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    maxWidth: '280px',
    marginBottom: '20px'
  };

  const badgeWrapperStyle = (index: number): React.CSSProperties => ({
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: visibleBadges.includes(index) 
      ? (hoveredBadge === index ? 'translateY(-8px) scale(1.1)' : 'translateY(0) scale(1)')
      : 'translateY(20px) scale(0.8)',
    opacity: visibleBadges.includes(index) ? 1 : 0,
    transformOrigin: 'center bottom'
  });

  const badgeStyle = (badge: Badge, index: number): React.CSSProperties => ({
    position: 'relative',
    background: badge.gradient,
    color: 'white',
    padding: '12px 16px',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: hoveredBadge === index 
      ? `0 8px 25px ${badge.shadowColor}, 0 0 20px ${badge.shadowColor}`
      : `0 4px 15px ${badge.shadowColor}`,
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    minWidth: '120px',
    justifyContent: 'center'
  });

  const badgeGlowStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.6s ease',
    pointerEvents: 'none'
  };

  const badgeGlowActiveStyle: React.CSSProperties = {
    ...badgeGlowStyle,
    left: '100%'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '20px',
    transition: 'transform 0.3s ease',
    transform: hoveredBadge !== null ? 'rotate(10deg) scale(1.1)' : 'rotate(0deg) scale(1)'
  };

  const badgeTextStyle: React.CSSProperties = {
    fontWeight: '600',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  };

  const tooltipStyle = (index: number): React.CSSProperties => ({
  position: 'absolute',
  bottom: '120%',
  left: '50%',
  background: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
  fontSize: '11px',
  padding: '6px 10px',
  borderRadius: '6px',
  whiteSpace: 'nowrap',
  transition: 'all 0.3s ease',
  opacity: hoveredBadge === index ? 1 : 0,
  visibility: hoveredBadge === index ? 'visible' : 'hidden',
  transform: hoveredBadge === index 
    ? 'translateX(-50%) translateY(0)' 
    : 'translateX(-50%) translateY(4px)',
  pointerEvents: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 10
});


  const tooltipArrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '4px solid rgba(0, 0, 0, 0.9)'
  };

  const progressContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    transition: 'all 0.8s ease',
    transitionDelay: '0.8s',
    transform: showStats ? 'translateY(0)' : 'translateY(15px)',
    opacity: showStats ? 1 : 0
  };

  const progressDotStyle = (index: number): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
    transitionDelay: `${index * 150}ms`,
    backgroundColor: visibleBadges.includes(index) ? '#3b82f6' : '#4b5563',
    transform: visibleBadges.includes(index) ? 'scale(1.2)' : 'scale(1)',
    boxShadow: visibleBadges.includes(index) 
      ? '0 0 10px rgba(59, 130, 246, 0.6)' 
      : 'none',
    animation: visibleBadges.includes(index) ? 'pulse 2s ease-in-out infinite' : 'none'
  });

  const statsStyle: React.CSSProperties = {
    textAlign: 'center',
    transition: 'all 0.8s ease',
    transitionDelay: '1s',
    transform: showStats ? 'translateY(0)' : 'translateY(20px)',
    opacity: showStats ? 1 : 0
  };

  const statsTextStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#9ca3af'
  };

  const highlightNumberStyle: React.CSSProperties = {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: '15px',
    textShadow: '0 0 8px rgba(59, 130, 246, 0.4)'
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundEffectStyle}></div>
      
      {/* Floating sparkles */}
      {sparklePositions.map((_, index) => (
        <div key={index} style={sparkleStyle(index)}>✨</div>
      ))}

      {/* Header */}
      <div style={headerStyle}>
        <div style={trophyStyle}>🏆</div>
        <div style={headerTextStyle}>Your Achievements</div>
      </div>

      {/* Badges */}
      <div style={badgesContainerStyle}>
        {badges.map((badge, index) => (
          <div
            key={badge.name}
            style={badgeWrapperStyle(index)}
            onMouseEnter={() => setHoveredBadge(index)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div style={badgeStyle(badge, index)}>
              <div style={hoveredBadge === index ? badgeGlowActiveStyle : badgeGlowStyle}></div>
              <span style={iconStyle}>{badge.icon}</span>
              <span style={badgeTextStyle}>{badge.name}</span>
            </div>
            
            {/* Tooltip */}
            <div style={tooltipStyle(index)}>
              {badge.description}
              <div style={tooltipArrowStyle}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div style={progressContainerStyle}>
        {badges.map((_, index) => (
          <div key={index} style={progressDotStyle(index)} />
        ))}
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statsTextStyle}>
          <span style={highlightNumberStyle}>{visibleBadges.length}</span>
          <span> / {badges.length} Unlocked</span>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-4px);
          }
          90% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default Badges;