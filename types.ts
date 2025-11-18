export type Language = 'en' | 'am';

export enum ViewState {
  DASHBOARD = 'dashboard',
  STUDY_HUB = 'study_hub',
  AI_TUTOR = 'ai_tutor',
  ANALYZER = 'analyzer',
  QUIZ = 'quiz'
}

export interface UserStats {
  streak: number;
  xp: number;
  level: number;
  studyMinutes: number;
  questionsAnswered: number;
}

export interface Subject {
  id: string;
  nameEn: string;
  nameAm: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface AnalysisResult {
  source: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'National Exam';
  successRate: number;
  similarQuestions: string[];
  topics: string[];
  explanation: string;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  durationMinutes: number;
  isCompleted: boolean;
  type: 'reading' | 'quiz' | 'video' | 'practice';
}

export interface StudyPlan {
  goals: string;
  weakAreas: string[];
  tasks: StudyTask[];
}