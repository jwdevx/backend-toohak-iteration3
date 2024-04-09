/**
 * H17B_CRUNCHIE 1531 24T1
 * dataStore.ts - stores all interface and database
 */

// =============================================================================
// ========================= INTERFACE FOR USERS ===============================
// =============================================================================

export interface oldPasswords {
  password: string;
}
export interface Users {
  userId: number;
  nameFirst: string;
  nameLast: string;
  name: string;
  email: string;
  password: string;
  oldPasswords: oldPasswords[];
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}
export interface Tokens {
  sessionId: number;
  userId: number;
}

// =============================================================================
// ======================== INTERFACE FOR QUIZZES ==============================
// =============================================================================

export interface Quizzes {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  owner: number;
  numQuestions: number;
  questions: Questions[];
  intrash: boolean;
  duration: number;
  thumbnailUrl: string;
}
export interface Questions {
  questionId: number
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
  thumbnailUrl: string;
}
export interface Answer {
  answerId: number;
  answer: string;
  correct: boolean;
  colour: string;
}
export interface answer {
  answer: string;
  correct: boolean;
}

// =============================================================================
// ======================== SPECIFIC FOR INPUT TYPE ============================
// =============================================================================

// Specific for iteration 2, input parameter
export interface QuestionBody {
  question: string;
  duration: number;
  points: number;
  answers: answer[];
}

// Specific for iteration 3, input parameter
export interface QuestionBodyV2 {
  question: string;
  duration: number;
  points: number;
  answers: answer[];
  thumbnailUrl: string;
}
export interface QuestionV1 {
  questionId: number
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
}
// =============================================================================
// ========================= INTERFACE FOR ENUM ================================
// =============================================================================

export enum state {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}
export enum action {
  NEXT_QUESTION = 'NEXT_QUESTION',
  SKIP_COUNTDOWN = 'SKIP_COUNTDOWN',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END'
}

// =============================================================================
// ======================= INTERFACE FOR SESSION ===============================
// =============================================================================

export interface Session {
  quizId: number,
  sessionId: number,
  owner: number,
  autoStartNum: number;

  // State
  startTime: number,
  state: state,
  atQuestion: number,

  // Adding players and recording answers
  players: player[],
  numPlayers: number,
  metadata: Quizzes,

  // Recording Results of each question
  questionResults: questionResults[],
  messages: chat[],
}

// Specific only for return type
export interface usersRankedByScore {
  name: string,
  score: number,
}

export interface metaData {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions : Questions[];
  duration: number;
  thumbnailURL: string;
}

export interface questionResults {
  questionId: number,
  playersCorrectList: string[],
  averageAnswerTime: number,
  percentCorrect: number,
}

// =============================================================================
// ========================= INTERFACE FOR CHATS ===============================
// =============================================================================

// Specific only for return type for playerSendChat function
export interface message {
  messageBody: string;
}
export interface chat {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number,
}

// =============================================================================
// ======================== INTERFACE FOR PLAYERS ==============================
// =============================================================================

export interface player {
  playerId: number,
  playerName: string,
  totalScore: number,
  answers: playerAnswers[],
}
export interface playerAnswers {
  correct: boolean,
  score: number,
  answerIds: number[],
  answerTime: number,
}

// =============================================================================
// ======================= INTERFACE FOR DATASTORE =============================
// =============================================================================

export interface DataStore {
  users: Users[];
  quizzes: Quizzes[];
  tokens: Tokens[];
  sessions: Session[];
}
let data: DataStore = {
  users: [],
  quizzes: [],
  tokens: [],
  sessions: [],
};

// =============================================================================
// ======  YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1 ======
// =============================================================================

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore) {
  data = newData;
}
export { getData, setData };
