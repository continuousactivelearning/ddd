import React, { useState } from 'react';

interface EvaluationData {
  peerName: string;
  assignmentTitle: string;
  subject: string;
  pdfUrl: string; // Replace with actual file URL if available
}

const mockAssignment: EvaluationData = {
  peerName: 'John Doe',
  assignmentTitle: 'Electricity and Magnetism Report',
  subject: 'Physics',
  pdfUrl: 'https://example.com/sample-assignment.pdf', // Replace with actual URL or Blob
};

const AssignmentEvaluation: React.FC = () => {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
  };

  return (
    <div style={{ padding: '40px', paddingLeft: '230px', backgroundColor: 'white', minHeight: '100vh' }}>
      {!submitted ? (
        <div style={{
          maxWidth: '800px',
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
          <p style={{ color: '#4B5563', marginBottom: '20px' }}>
            Evaluate the submitted assignment below.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 'bold', color: '#047857' }}>{mockAssignment.assignmentTitle}</p>
            <p style={{ color: '#4B5563' }}>
              <span style={{ fontWeight: 'medium' }}>Submitted by:</span> {mockAssignment.peerName}
            </p>
            <p style={{ color: '#4B5563' }}>
              <span style={{ fontWeight: 'medium' }}>Subject:</span> {mockAssignment.subject}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <iframe
              src={mockAssignment.pdfUrl}
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
                width: '100%',
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
            Thank you for evaluating <strong>{mockAssignment.peerName}'s</strong> assignment.
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
            Evaluate Another Assignment
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentEvaluation;
