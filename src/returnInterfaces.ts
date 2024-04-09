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

// ============================= session.ts ====================================

// ============================= player.ts =====================================
