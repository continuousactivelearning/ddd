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
    pdfUrl: '/pdfs/sample1.pdf', 
  },
  {
    id: '2',
    peerName: 'Gaurpad Shukla',
    assignmentTitle: 'Cloud Essentials',
    subject: 'Cloud Computing',
    pdfUrl: '/pdfs/sample2.pdf',
  },
  {
    id: '3',
    peerName: 'Yoegsh Tharwani',
    assignmentTitle: 'Algorithm Analysis',
    subject: 'Data Structures and Algorithms',
    pdfUrl: '/pdfs/sample3.pdf',
  },
  {
    id: '4',
    peerName: 'Jhalak',
    assignmentTitle: 'Nested SQL Queries',
    subject: 'SQL and Analytics',
    pdfUrl: '/pdfs/sample4.pdf',
  },
];
