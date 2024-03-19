
/**
 * H17B_CRUNCHIE 1531 24T1
 * dataStore.ts - stores all interface and database
 */

// =============================================================================
// ========================= INTERFACE FOR USERS ===============================
// =============================================================================
export interface ErrorObject {
  error: string;
  status: number;
}

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

export interface DataStore {
  users: Users[];
//   counterId: number;
  quizzes: Quizzes[];
  tokens: Tokens[];
}

let data: DataStore = {
  users: [],
  //   counterId: 1,
  quizzes: [],
  tokens: [],
};

// =============================================================================
// ======================== INTERFACE FOR QUIZZES ==============================
// =============================================================================

export interface Questions {
  // TODO
  question: string;
}

export interface Quizzes {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  owner: number;
  questions: Questions[];
  intrash: boolean;
}

// =============================================================================
// ======================== INTERFACE FOR QUESTIONS ============================
// =============================================================================

// TODO interfaces for all things related to quesitons ->

// =============================================================================
// ======================== INTERFACE FOR TRASH ================================
// =============================================================================

// TODO interfaces for all things related to trash ->

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
