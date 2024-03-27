import validator from 'validator';
import { getData, answer } from './dataStore';
import { Users, DataStore, Tokens, Quizzes } from './dataStore';

/**
 * Helper Function used in auth.js,
 * Checks if the provided Token is invalid (does not refer to valid logged in user session)
 *
 * @param {number} sessiondId
 * @returns {boolean} Returns true if token is valid
 */
export function findSessionId(sessionId: number): Tokens | undefined {
  const data: DataStore = getData();
  return data.tokens.find(token => token.sessionId === sessionId);
}

/**
 * Helper Function used in auth.js, quiz.js
 * Checks if the provided AuthUserId does not correspond to any existing user.
 *
 * @param {number} authUserId - The user ID to be validated.
 * @returns {boolean} Returns true if the AuthUserId does not match any existing user's userId
 */
export function findUserId(authUserId: number): Users | undefined {
  const data: DataStore = getData();
  return data.users.find(user => user.userId === authUserId);
}

/**
 * Helper Function used in auth.js
 * Validates an email address to check if email does not satisfy
 * this: https://www.npmjs.com/package/validator (validator.isEmail)
 *
 * Uses the `validator` library's `isEmail` method to perform the validation.
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - Returns true if the email is invalid, false otherwise.
 */
export function invalidEmail(email: string): boolean {
  return !validator.isEmail(email);
}

/**
 * Helper Function used in auth.js
 * Test if nameFirst or nameLast contains characters other than lowercase letters,
 * uppercase letters, spaces, hyphens, or apostrophes.
 *
 * @param {string} name - The name to be validated.
 * @returns {boolean} - Returns true if the name contains invalid characters
 */
export function invalidUserName(name: string): boolean {
  const regex = /^[a-zA-Z\s\-']+$/;
  return !(regex.test(name));
}

/**
 * Helper Function used in auth.js
 * Check if nameFirst or nameLast is less than 2 characters or more than 20 characters.
 *
 * @param {string} name - The name string to be validated for length.
 * @returns {boolean} - Returns true if name is invalid (either too short or too long).
 */
export function invalidNameLength(name: string): boolean {
  return (name.length < 2 || name.length > 20);
}

// =============================================================================
// ==============================   QUIZ.TS  ===================================
// =============================================================================
/**
 * Helper Function used in quiz.js
 * Checks if the provided quiz name does not correspond to any existing quiz.
 *
 * @param {number} validToken - The quiz name to be validated.
 * @param {string} name - The
 * @returns {boolean} Returns true if the name does not match any existing quiz's name
 */
export function UsedQuizName(userId: number, name: string): boolean {
  const data: DataStore = getData();
  return data.quizzes.some(quiz => quiz.owner === userId && quiz.name === name && quiz.intrash === false);
}

/**
 * Helper Function used in quiz.js
 * Check if name is less than 3 characters or more than 30 characters.
 *
 * @param {string} name - The name string to be validated for length.
 * @returns {boolean} - Returns true if name is invalid (either too short or too long).
 */
export function invalidQuizNameLength(name: string): boolean {
  return (name.length < 3 || name.length > 30);
}

/**
 * Helper Function used in quiz.js
 * Check if descriptionis less than 2 characters or more than 100 characters.
 *
 * @param {string} name - The description string to be validated for length.
 * @returns {boolean} - Returns true if description is invalid (either too short or too long).
 */
export function invalidDescriptionLength(name: string): boolean {
  return (name.length > 100);
}

/**
 * Helper Function used in quiz.js
 * Test if quiz name contains characters other than lowercase letters,
 * uppercase letters, spaces or numbers.
 *
 * @param {string} name - The name to be validated.
 * @returns {boolean} - Returns true if the name contains invalid characters
 */
export function invalidQuizName(name: string): boolean {
  const isAlphanumericAndSpaces = validator.isWhitelisted(name,
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ');
  return (!isAlphanumericAndSpaces);
}

/**
 * Helper Function used in quiz.js
 * Checks if the provided quizId corresponds to any existing quiz.
 *
 * @param {number} quizId - The quizId to be validated.
 * @returns {boolean} Returns true if the QuizId does not match any existing quizId.
 */
export function findQuizId(quizId: number): Quizzes | undefined {
  const data: DataStore = getData();
  return data.quizzes.find(quiz => quiz.quizId === quizId);
}

/**
 * Helper Function used in quiz.js
 * Checks if the provided Quiz ID does not refer to a quiz that this user owns.
 *
 * @param {number} UserId - A valid User ID.
 * @param {number} quizId - A valid Quiz ID.
 * @returns {boolean} Returns false if the QuizId does not match any existing authUserId.
 */
export function matchQuizIdAndAuthor(UserId: number, quizId: number): Quizzes | undefined {
  const data: DataStore = getData();
  return data.quizzes.find(quiz => quiz.quizId === quizId && quiz.owner === UserId);
}

/**
 * Helper Function used in quiz.js
 * Checks if the provided Quiz ID is in the trashbin.
 *
 * @param {number} quizId - A valid Quiz ID.
 * @returns {boolean} Returns false if the provided Quiz ID is in the trashbin.
 */
export function checkQuizInTrash(quizId: number): boolean | undefined {
  const quiz: Quizzes | undefined = findQuizId(quizId);
  if (!quiz) return undefined;
  return quiz.intrash;
}

// =============================================================================
// ==========================   QUESTION.TS  ===================================
// =============================================================================

/**
 * Helper Function used in question.ts
 * Checks if the provided question string length is with in the given parameter
 *
 * @param {string} question - A question string
 * @returns {boolean} Returns false if the provided question string is out of the given parameter.
 */
export function checkQuestionLength(question: string): boolean {
  return question.length < 5 || question.length > 50;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided duration is a positive number
 *
 * @param {number} duration - A question duration
 * @returns {boolean} Returns false if the provided duration is not a positive number.
 */
export function checkQuestionDuration(duration: number): boolean {
  return duration <= 0;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided question point is with in the given parameter
 *
 * @param {number} points - A question points
 * @returns {boolean} Returns false if the provided question point is out of the given parameter.
 */
export function checkQuestionPoints(points: number): boolean {
  return points < 1 || points > 10;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided question has number of answers with in the given parameter
 *
 * @param {answer[]} answers - Answers for the question
 * @returns {boolean} Returns false if the provided number of answers for the question is out of the given parameter.
 */
export function checkAnswerNum(answers: answer[]): boolean {
  return answers.length < 2 || answers.length > 6;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided question string length is with in the given parameter
 *
 * @param {number} quizId - A valid Quiz ID.
 * @param {string} duration - A question string
 * @returns {boolean} Returns false if the provided quiz has a total duration which is out of the given parameter.
 */
export function checkQuestionDurationSum(quizId:number, duration: number): boolean {
  const data: DataStore = getData();
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!quiz) return true;
  return quiz.duration + duration > 180;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided answers have length with in the given parameter
 *
 * @param {answer[]} answers - Answers for the question
 * @returns {boolean} Returns false if the provided answers have a length that is out of the given parameter.
 */
export function checkAnswerLength(answers: answer[]): boolean {
  for (const answer of answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) return true;
  }
  return false;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided answer has a duplicate
 *
 * @param {answer[]} answers - Answers for the question
 * @returns {boolean} Returns false if the provided  answers for the question has a duplicate with in the question.
 */
export function checkAnswerDuplicate(answers: answer[]): boolean {
  const uniqueAnswers = new Set<string>();
  for (const answer of answers) {
    if (uniqueAnswers.has(answer.answer)) {
      return true;
    }
    uniqueAnswers.add(answer.answer);
  }
  return false;
}

/**
 * Helper Function used in question.ts
 * Checks if the provided answers have a correct answer amidst them
 *
 * @param {string} answers - Answers for the question
 * @returns {boolean} Returns false if the provided  answers has no correct answer amidst them.
 */
export function checkAnswerCorrect(answers: answer[]) : boolean {
  const found = answers.find(answer => answer.correct === true);
  if (found) return false;
  return true;
}

/**
 * Helper Function used in question.ts
 * This function generates a random ID everytime it is called
 *
 * @returns {number} Returns a random ID.
 */
export function randomIdGenertor() : number {
  return Math.floor(Math.random() * Math.floor(10000));
}

/**
 * Helper Function used in question.ts
 * This function provides the current time
 *
 * @returns {number} Returns a current time.
 */
export function getNow() : number {
  return Math.floor(Date.now() / 1000);
}
