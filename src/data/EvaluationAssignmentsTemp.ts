export interface EvaluationAssignment {
  id: string;
  peerName: string;
  assignmentTitle: string;
  subject: string;
  pdfUrl: string;
}

export const evaluationAssignments: EvaluationAssignment[] = [
  {
    id: '1',
    peerName: 'Anshika Shukla',
    assignmentTitle: 'Backend integration with frontend',
    subject: 'MERN Stack Development',
    pdfUrl: '/pdfs/sample1.pdf', // Replace with actual file URL if available
  },
  {
    id: '2',
    peerName: 'Gaurpad Shukla',
    assignmentTitle: 'Chemistry Lab Analysis',
    subject: 'Chemistry',
    pdfUrl: '/pdfs/sample2.pdf',
  },
  // Add more mock assignments as needed
];
