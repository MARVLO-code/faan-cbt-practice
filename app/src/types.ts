export type Category = 'general' | 'mechanical';
export type QuestionType = 'past' | 'likely';

export interface Question {
  id: string;
  category: Category;
  type: QuestionType;
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export type CategoryChoice = Category | 'mixed';
export type ModeChoice = QuestionType | 'mixture';

export interface SessionConfig {
  category: CategoryChoice;
  mode: ModeChoice;
  numQuestions: number;
  durationMinutes: number;
}

export interface Answer {
  questionId: string;
  selectedIndex: number | null;
}

export interface SessionResult {
  config: SessionConfig;
  questions: Question[];
  answers: Answer[];
  startedAt: number;
  finishedAt: number;
  timedOut: boolean;
}
