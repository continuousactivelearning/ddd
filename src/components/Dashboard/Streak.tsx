import React, { useState, useEffect } from 'react';

const Streak: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [flame, setFlame] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
    const flameInterval = setInterval(() => {
      setFlame(prev => !prev);
    }, 1500);
    
    return () => clearInterval(flameInterval);
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 40%, transparent 70%)',
    pointerEvents: 'none'
  };

  const mainContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    padding: '1rem 0',
    transition: 'all 1s ease',
    transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
    opacity: isVisible ? 1 : 0
  };

  const flameContainerStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const flameStyle: React.CSSProperties = {
    fontSize: '48px',
    transition: 'all 0.5s ease',
    transform: flame ? 'scale(1.1)' : 'scale(1)',
    position: 'relative',
    display: 'inline-block'
  };

  const flameBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#fde047',
    animation: 'pulse 2s infinite'
  };

  const flameForegroundStyle: React.CSSProperties = {
    position: 'relative',
    color: '#fb923c'
  };

  const glowRingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    border: '2px solid rgba(251, 146, 60, 0.3)',
    borderRadius: '50%',
    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
  };

  const streakCountStyle: React.CSSProperties = {
    marginBottom: '12px',
    transition: 'all 0.7s ease',
    transitionDelay: '0.3s',
    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
    opacity: isVisible ? 1 : 0
  };

  const streakNumberStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #fb923c, #fde047, #fb923c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
    lineHeight: '1.2'
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '16px',
    transition: 'all 0.7s ease',
    transitionDelay: '0.5s',
    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
    opacity: isVisible ? 1 : 0
  };

  const labelTextStyle: React.CSSProperties = {
    color: '#d1d5db',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.7s ease',
    transitionDelay: '0.7s',
    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
    opacity: isVisible ? 1 : 0
  };

  const dotStyle = (index: number): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: index < 7 ? '#fb923c' : '#374151',
    transition: 'all 0.3s ease',
    animationDelay: `${index * 100}ms`
  });

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      
      <div style={mainContentStyle}>
        <div style={flameContainerStyle}>
          <div style={flameStyle}>
            <div style={flameBackgroundStyle}>🔥</div>
            <div style={flameForegroundStyle}>🔥</div>
          </div>
          <div style={glowRingStyle}></div>
        </div>

        <div style={streakCountStyle}>
          <div style={streakNumberStyle}>
            7 Days
          </div>
        </div>

        <div style={labelStyle}>
          <div style={labelTextStyle}>
            Current Streak
          </div>
        </div>

        <div style={dotsContainerStyle}>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              style={dotStyle(i)}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Streak;