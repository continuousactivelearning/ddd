import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Clock, Users, Award, BarChart2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentDashboard.css';
import Chatbot from '../components/ui/Chatbot';

const StudentDashboard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [showMainContent, setShowMainContent] = useState(false);
  const hasDraggedRef = useRef(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseDown = (e) => {
    if (!hasDraggedRef.current) {
      setIsDragging(true);
      setStartY(e.clientY);
      setCurrentY(e.clientY);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const dragDistance = startY - currentY;
    if (dragDistance > 100 && !hasDraggedRef.current) {
      setShowMainContent(true);
      hasDraggedRef.current = true;
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1000);
    } else {
      setCurrentY(startY);
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!hasDraggedRef.current && e.touches && e.touches.length === 1) {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length !== 1) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const dragDistance = startY - currentY;
    if (dragDistance > 100 && !hasDraggedRef.current) {
      setShowMainContent(true);
      hasDraggedRef.current = true;
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1000);
    } else {
      setCurrentY(startY);
    }
    setIsDragging(false);
  };

  return (
    <div 
      className="student-dashboard"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: showMainContent ? 'auto' : '100vh',
        overflowY: showMainContent ? 'auto' : 'hidden',
        transition: 'height 0.5s ease-in-out',
        background: 'linear-gradient(135deg, #1a1c2e 0%, #2d1b69 100%)',
      }}
    >
      <DashboardHeader />
      <Chatbot />

      {!showMainContent && (
        <div className="drag-prompt">
          <div className="welcome-text-container">
            <h2 className="welcome-message">
              <span>
                <span className="greeting">Hey</span>{' '}
                <span className="username">{user?.name?.split(' ')[0] || 'Student'}</span>
              </span>
              <span className="welcome-text">welcome to your dashboard!</span>
            </h2>
            <p className="drag-instruction">
              <span className="instruction-text">Drag up to reveal its amazing features</span>
            </p>
          </div>
          <div className="arrow-up"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StudentDashboard); 