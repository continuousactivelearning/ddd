export interface User {
  _id?: string;
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Course {
  _id?: string;
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  createdAt?: Date;
}

export interface Question {
  _id?: string;
  id: number;
  courseId: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  createdAt?: Date;
}

export interface Assessment {
  _id?: string;
  id: number;
  userId: string;
  courseId: number;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  scorePercentage: number;
  startedAt: Date;
  completedAt?: Date;
  status: 'in_progress' | 'completed';
  score: string;
  timeSpent: number;
  createdAt?: Date;
}

// Insert types (without auto-generated fields)
export type InsertUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type InsertCourse = Omit<Course, '_id' | 'id' | 'createdAt'>;
export type InsertQuestion = Omit<Question, '_id' | 'id' | 'createdAt'>;
export type InsertAssessment = Omit<Assessment, '_id' | 'id' | 'createdAt'>;
export type UpsertUser = InsertUser;