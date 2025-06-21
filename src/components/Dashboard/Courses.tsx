import React, { useState } from 'react';


type Course = {
  id: number;
  title: string;
  progress: number;
  rarity: 'common' | 'rare' | 'legendary' | 'epic';
  description: string;
  icon: string;
};

const coursesData: Course[] = [
  { id: 1, title: 'Data Structure and Algorithms', progress: 75, rarity: 'rare', description: 'Master data structures & algorithms', icon: '⚡' },
  { id: 2, title: 'MERN Stack Development', progress: 40, rarity: 'common', description: 'Build modern web applications', icon: '🏗️' },
  { id: 3, title: 'SQL and Analytics', progress: 60, rarity: 'legendary', description: 'Understand machine learning fundamentals', icon: '🤖' },
  { id: 4, title: 'Cloud Practitioner and Architect', progress: 25, rarity: 'epic', description: 'Design scalable system architectures', icon: '🏛️' },
];

const getRarityColors = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return { border: '#9CA3AF', bg: '#F9FAFB', text: '#374151', tag: '#6B7280' };
    case 'rare':
      return { border: '#3B82F6', bg: '#EFF6FF', text: '#1E40AF', tag: '#22c55e' };
    case 'legendary':
      return { border: '#F59E0B', bg: '#FFFBEB', text: '#92400E', tag: '#D97706' };
      case 'epic':
      return { border: '#F59E0B', bg: '#c2f7d5', text: '#92400E', tag: '#6B7280' };
    default:
      return { border: '#9CA3AF', bg: '#F9FAFB', text: '#374151', tag: '#6B7280' };
  }
};

const Courses: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedCourseId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ padding: '24px', background: 'transparent', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: '32px' }}>
        Courses Overview
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '24px',
          maxWidth: '768px',
          margin: '0 auto',
        }}
      >
        {coursesData.map(course => {
          const isSelected = course.id === selectedCourseId;
          const colors = getRarityColors(course.rarity);
          const isCompleted = course.progress === 100;

          return (
            <div
              key={course.id}
              onClick={() => handleSelect(course.id)}
              style={{
                position: 'relative',
                padding: '24px',
                borderRadius: '16px',
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                boxShadow: isSelected ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
              }}
            >
              {/* Rarity Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: colors.tag,
                  color: 'white',
                  padding: '4px 8px',
                  fontSize: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                {course.rarity}
              </div>

              {/* Checkmark */}
              {isCompleted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#10B981',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="white"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div style={{ fontSize: '32px', textAlign: 'center', marginTop: '32px', marginBottom: '16px' }}>
                {course.icon}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '8px',
                  color: colors.text,
                }}
              >
                {course.title}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#4B5563',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                {course.description}
              </p>

              {/* Progress Text */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ color: '#6B7280', fontWeight: 500 }}>Progress</span>
                <span style={{ fontWeight: 600, color: colors.text }}>{course.progress}/100</span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '8px' }}>
                <div
                  style={{
                    width: `${course.progress}%`,
                    height: '100%',
                    background: colors.border,
                    borderRadius: '8px',
                    transition: 'width 0.5s ease-out',
                  }}
                />
              </div>

              {/* Selection Outline */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    pointerEvents: 'none',
                    boxShadow: `0 0 0 3px ${colors.border}40`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
