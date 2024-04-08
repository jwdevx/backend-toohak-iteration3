import { metaData, state } from './dataStore';

export interface ErrorObject {
  error: string;
}
export interface ErrorObjectStatus {
  error: string;
  status: number;
}

// =============================== other.ts ====================================

export type EmptyObject = Record<string, never>;

// =============================== auth.ts =====================================

export interface UserCreateReturn {
  token: string;
}

// =============================== quiz.ts =====================================
export interface QuizCreateReturn {
  quizId: number;
}
// ============================== question.ts ==================================
export interface QuestionCreateReturn {
  questionId: number;
}
// ============================= session.ts ====================================
export interface SessionCreateReturn {
  sessionId: number;
}

export interface SessionStatusReturn {
  state: state,
  atQuestion: number,
  players: string[],
  metadata: metaData
}
// ============================= player.ts =====================================
