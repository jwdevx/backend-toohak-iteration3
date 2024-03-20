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
 * @param {integer} authUserId - The user ID to be validated.
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
  return data.quizzes.some(quiz => quiz.owner === userId && quiz.name === name);
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
 * @param {integer} quizId - The quizId to be validated.
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
 * @param {integer} authUserId - A valid User ID.
 * @param {integer} quizId - A valid Quiz ID.
 * @returns {boolean} Returns false if the QuizId does not match any existing authUserId.
 */
export function matchQuizIdAndAuthor(authUserId: number, quizId: number): boolean {
  const data: DataStore = getData();

  for (const quiz of data.quizzes) {
    if (quiz.owner === authUserId && quiz.quizId === quizId) {
      return true;
    }
  }
  return false;
}

/**
 * Helper Function used in quiz.js
 * Checks if the provided Quiz ID is in the trashbin.
 *
 * @param {integer} quizId - A valid Quiz ID.
 * @returns {boolean} Returns false if the provided Quiz ID is in the trashbin.
 */
export function checkQuizInTrash(quizId: number): boolean | undefined {
  const quiz: Quizzes | undefined = findQuizId(quizId);
  if (!quiz) return undefined;
  return quiz.intrash;
}

export function checkQuestionLength(question: string): boolean {
  return question.length < 5 || question.length > 50;
}

export function checkQuestionDuration(duration: number): boolean {
  return duration < 0;
}

export function checkQuestionPoints(points: number): boolean {
  return points < 1 || points > 10;
}

export function checkAnswerNum(answers: answer[]): boolean {
  return answers.length < 2 || answers.length > 6;
}

export function checkQuestionDurationSum(quizId:number, duration: number): boolean {
  const data = getData();
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!quiz) return true;
  return quiz.duration + duration > 180;
}

export function checkAnswerLength(answers: answer[]): boolean {
  for (const answer of answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) return true;
  }
  return false;
}

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

export function checkAnswerCorrect(answers: answer[]) : boolean {
  const found = answers.find(answer => answer.correct === true);
  if (found) return false;
  return true;
}
