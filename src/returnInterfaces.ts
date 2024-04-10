import { metaData, state } from './dataStore';

export interface ErrorObject {
  error: string;
}
export interface ErrorObjectStatus {
  error: string;
  status: number;
}

import { Questions, QuestionV1 } from './dataStore';
// =============================== other.ts ====================================

export type EmptyObject = Record<string, never>;

// =============================== auth.ts =====================================

export interface UserCreateReturn {
  token: string;
}

// =============================== quiz.ts =====================================

export interface quizInfoV1Return {
  quizId: number,
  name: string
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: QuestionV1[]
}

export interface quizListReturn {
   quizId: number;
   name: string;
}


export interface quizTrashViewReturn {
  quizId: number;
  name: string;
}

export interface quizInfoV2Return {
  quizId: number,
  name: string
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: Questions[]
  duration: number,
  thumbnailUrl:string,
}

export interface QuizCreateReturn {
  quizId: number;
}
// ============================== question.ts ==================================
export interface QuestionCreateReturn {
  questionId: number,
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
