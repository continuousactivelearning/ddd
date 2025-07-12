import React, { useState } from 'react';
import { evaluationAssignments } from '../data/EvaluationAssignmentsTemp';
import type { EvaluationAssignment } from '../data/EvaluationAssignmentsTemp';


  

// Alternative: Generate simple anonymous IDs
const generateAnonymousId = (realName: string, assignmentId: string): string => {
  const hash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const seed = hash(realName + assignmentId);
  const id = (seed % 9999) + 1000; // Generate 4-digit ID
  return `Anonymous-${id}`;
};


const AssignmentEvaluation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false); 
  const [error, setError] = useState('');

  const currentAssignment: EvaluationAssignment | undefined = evaluationAssignments[currentIndex];

  // Generate anonymous identifier
  const getAnonymousIdentifier = (realName: string, assignmentId: string): string => {
    return generateAnonymousId(realName, assignmentId);
  };

  const handleSubmit = () => {
    if (!score || isNaN(Number(score)) || Number(score) < 0 || Number(score) > 100) {
      setError('Please enter a valid score between 0 and 100.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const resetEvaluation = () => {
    setScore('');
    setFeedback('');
    setSubmitted(false);
    if (currentIndex + 1 < evaluationAssignments.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentAssignment) return <h2 style={{ paddingLeft: '230px' }}>No assignments to evaluate.</h2>;

  const anonymousIdentifier = getAnonymousIdentifier(currentAssignment.peerName, currentAssignment.id || currentIndex.toString());

  return (
    <div style={{ padding: '40px', paddingLeft: '230px', backgroundColor: 'transparent', minHeight: '100vh' }}>
      {!submitted ? (
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '8px' }}>
            Assignment Evaluation
          </h2>
          
          {/* Anonymous Notice */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#1E40AF', fontSize: '14px', margin: 0 }}>
              🔒 <strong>Anonymous Review:</strong> Student identity is hidden to ensure fair evaluation.
            </p>
          </div>

          <p style={{ color: '#4B5563', marginBottom: '20px' }}>
            Evaluate the assignment submitted by <strong style={{ color: '#047857' }}>{anonymousIdentifier}</strong>.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 'bold', color: '#047857' }}>{currentAssignment.assignmentTitle}</p>
            <p style={{ color: '#4B5563' }}><strong>Subject:</strong> {currentAssignment.subject}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <iframe
              src={currentAssignment.pdfUrl}
              title="Assignment PDF"
              style={{
                width: '100%',
                height: '500px',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#047857', fontWeight: 'bold', marginBottom: '6px' }}>
              Score (0 - 100) *
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              style={{
                width: '40%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
              placeholder="Enter score"
            />
            {error && (
              <p style={{ color: 'red', marginTop: '6px', fontSize: '14px' }}>{error}</p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#047857', fontWeight: 'bold', marginBottom: '6px' }}>
              Evaluation Description *
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
              placeholder="Explain your evaluation and how you arrived at the score"
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#047857',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Submit Evaluation
          </button>
        </div>
      ) : (
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#047857', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
            Evaluation Submitted!
          </h2>
          <p style={{ color: '#4B5563', marginBottom: '20px' }}>
            You evaluated <strong>{anonymousIdentifier}</strong>'s assignment.
          </p>
          <div style={{
            textAlign: 'left',
            padding: '16px',
            backgroundColor: '#F0FDF4',
            borderRadius: '8px',
            border: '1px solid #D1FAE5'
          }}>
            <p style={{ color: '#065F46' }}><strong>Score:</strong> {score}</p>
            <p style={{ color: '#065F46', marginTop: '8px' }}><strong>Feedback:</strong></p>
            <p style={{ color: '#065F46' }}>{feedback}</p>
          </div>
          <button
            onClick={resetEvaluation}
            style={{
              marginTop: '24px',
              backgroundColor: '#047857',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Evaluate Next Assignment
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentEvaluation;