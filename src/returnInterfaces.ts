import { metaData, state } from './dataStore';
import { Questions, QuestionV1 } from './dataStore';

export interface RequestHelperReturnType {
    bodyObj?: UserCreateReturn |
    UserDetailsReturn |

    QuizCreateReturn |
    QuestionCreateReturn |
    QuestionDuplicateReturn |

    SessionQuizViewReturn |
    SessionCreateReturn |
    SessionStatusReturn |

    PlayerJoinReturn |
    playerQuestionPositionInfoReturn|

    EmptyObject |
    ErrorObject;
    error?: string;
}

// =============================== other.ts ====================================
export interface ErrorObject {
  error: string;
}
export interface ErrorObjectStatus {
  error: string;
  status: number;
}

export type EmptyObject = Record<string, never>;

// =============================== auth.ts =====================================

export interface UserCreateReturn {
  token: string;
}

export interface UserDetailsReturn {
  user: UserDetails;
}
export interface UserDetails {
  userId: number;
  name: string;
  email: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}

// =============================== quiz.ts =====================================

export interface QuizCreateReturn {
  quizId: number;
}

export interface quizListReturn {
  quizId: number;
  name: string;
}

export interface quizInfoV1Return {
  quizId: number,
  name: string
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: QuestionV1[]
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

// ============================== question.ts ==================================

export interface QuestionCreateReturn {
  questionId: number,
}

export interface QuestionDuplicateReturn {
  newQuestionId: number,
}
// ============================= session.ts ====================================

export interface SessionQuizViewReturn {
    activeSessions: number[];
    inactiveSessions: number[];
}

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

export interface PlayerJoinReturn {
  playerId: number,
}

export interface playerQuestionPositionInfoReturn {
  questionId: number
  question: string;
  duration: number;
  thumbnailUrl: string;
  points: number;
  answers: playerQuestionPositionInfoReturnAnswer[];
}

export interface playerQuestionPositionInfoReturnAnswer {
  answerId: number;
  answer: string;
  colour: string;
}
