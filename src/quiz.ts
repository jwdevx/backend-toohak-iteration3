import { ErrorObject, Quizzes, DataStore, Questions, Users } from './dataStore';
import { setData, getData } from './dataStore';
import {
  findSessionId, findUserId, getNow, randomIdGenertor,
  invalidQuizName, invalidQuizNameLength, UsedQuizName,
  invalidDescriptionLength, findQuizId, matchQuizIdAndAuthor,
} from './helper';

/**
* Given basic details about a new quiz, create one for the logged in user.
*
* @param {string} token - the encoded session id of the user
* @param {string} name - the name of the quiz
* @param {string} description - the description of the quiz
* @returns {{quizID: number}} An object containing the authenticated quiz ID.
*/
export function adminQuizCreate(
  token: string,
  name: string,
  description: string): { quizId: number } | ErrorObject {
  // 1.Error 401
  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 400
  if (invalidQuizName(name)) return { error: 'The name is not valid', status: 400 };
  if (!name || invalidQuizNameLength(name)) {
    return { error: 'The name is either too long or too short', status: 400 };
  }
  if (UsedQuizName(validToken.userId, name)) {
    return { error: 'The name has already used for the quiz you created before', status: 400 };
  }
  // Note: empty strings are OK
  if (invalidDescriptionLength(description)) {
    return { error: 'The description is too long', status: 400 };
  }
  // Success 200
  const createdTime = Math.floor(new Date().getTime() / 1000);
  const id = randomIdGenertor();
  const quiz: Quizzes = {
    quizId: id,
    name: name,
    timeCreated: createdTime,
    timeLastEdited: createdTime,
    description: description,
    owner: validToken.userId,
    numQuestions: 0,
    questions: [],
    intrash: false,
    duration: 0
  };
  data.quizzes.push(quiz);
  setData(data);
  return {
    quizId: quiz.quizId,
  };
}

interface QuizSummary {
  quizId: number;
  name: string;
}
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {string} token -
 * @returns {{quizzes: json}} An json object containing the quizzes with their ID and name.
 */
export function adminQuizList(token: string): { quizzes: QuizSummary[] } | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // Success 200
  const quizarray : QuizSummary[] = [];
  const data: DataStore = getData();
  for (const quiz of data.quizzes) {
    if (quiz.owner === validToken.userId && quiz.intrash === false) {
      quizarray.push({
        quizId: quiz.quizId,
        name: quiz.name,
      });
    }
  }
  return {
    quizzes: quizarray,
  };
}

/**
 * provides information on the quiz
 *
 * @param {number} token - an encoded session ID of the user
 * @param {number} quizId - the authenticated quiz ID.
 * @returns {json} A json object containing the quiz info with their quizId,
 * name, timeCreated, timeLastEdited, description, and questions.
 */
export function adminQuizInfo(token: string, quizId: number): {
  quizId: number,
  name: string
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: Questions[]
} | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  // Success 200
  const quizInfo = {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    numQuestions: quiz.numQuestions,
    questions: quiz.questions,
    duration: quiz.duration
  };
  return quizInfo;
}

/**
*Update the name of the relevant quiz.
*
* @param {number} quizId - the authenticated quiz ID.
* @param {string} token - the encoded session id of the user
* @param {string} name - the name of the quiz
* @return{{}}empty object
*/
export function adminQuizNameUpdate(
  quizId: number,
  token: string,
  name: string): ErrorObject | Record<string, never> {
  // 1.Error 401
  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  // 3.Error 400
  if (invalidQuizName(name)) return { error: 'The name is not valid', status: 400 };
  if (!name || invalidQuizNameLength(name)) {
    return { error: 'The name is either too long or too short', status: 400 };
  }
  if (UsedQuizName(validToken.userId, name)) {
    return { error: 'The name has already used for the quiz you created before', status: 400 };
  }
  // Success 200
  quiz.name = name;
  const updatedTime = Math.floor(new Date().getTime() / 1000);
  quiz.timeLastEdited = updatedTime;
  setData(data);
  return {};
}

/**
*Update the description of the relevant quiz.
*
* @param {number} quizId- the authenticated quiz ID.
* @param {string} token - the encoded session id of the user
* @param {string} description - the description of the quiz
* @return{{}}empty object
*/
export function adminQuizDescriptionUpdate(
  quizId: number,
  token: string,
  description: string): ErrorObject | Record<string, never> {
  // 1.Error 401
  const data = getData();
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  // 3.Error 400, Note: empty strings are OK
  if (invalidDescriptionLength(description)) {
    return { error: 'The description is too long', status: 400 };
  }
  // Success 200
  quiz.description = description;
  quiz.timeLastEdited = Math.floor(new Date().getTime() / 1000);
  setData(data);
  return {};
}

/**
 * Transfer ownership of a quiz to a different user based on their email
 */
export function adminQuizTransfer(
  quizId: number,
  token: string,
  userEmail: string): Record<string, never> | ErrorObject {
  const data: DataStore = getData();
  // 1.Error 401 - check invalid Token
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  // 3.Error 400 - Check whether userEmail is valid
  const newQuizOwner: Users | undefined = data.users.find(u => u.email === userEmail);
  if (!newQuizOwner) return { error: 'userEmail is not a real user', status: 400 };
  // Check Email
  if (findUserId(validToken.userId).email === userEmail) {
    return { error: 'userEmail is the current logged in user', status: 400 };
  }
  // Check Name
  if (data.quizzes.some(q => q.owner === newQuizOwner.userId && q.name === quiz.name && q.intrash === false)) {
    return { error: 'Quiz ID refers to a quiz that has an invalid name', status: 400 };
  }

  // Success 200
  quiz.owner = newQuizOwner.userId;
  setData(data);
  return {};
}

// =============================================================================
// ============================ QUIZ TRASH =====================================
// =============================================================================

/**
 * Send a quiz to trash
 * @param {token} string - a valid sessionId
 * @param {number} quizID - the authenticated user ID.
 * @returns {} nothing
 */
export function adminQuizRemove(token: string, quizId: number): Record<string, never> | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  // Success 200
  quiz.timeLastEdited = Math.floor(new Date().getTime() / 1000);
  quiz.intrash = true;
  return {};
}

/**
 * View the quizzes in trash
 */
export function adminQuizTrashView(token: string): {quizzes: QuizSummary[]} | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // Success 200
  const data = getData();
  const quizzes : QuizSummary[] = [];
  for (const quiz of data.quizzes) {
    if (quiz.intrash === true && quiz.owner === validToken.userId) {
      const trash : QuizSummary = {
        quizId: quiz.quizId,
        name: quiz.name
      };
      quizzes.push(trash);
    }
  }
  return { quizzes: quizzes };
}

/**
 * Restore a quiz from trash
 */
export function adminQuizTrashRestore(token: string, quizId: number): Record<string, never> | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  if (!findQuizId(quizId)) {
    return { error: 'The quiz does not exist.', status: 403 };
  }
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (!quiz || isNaN(quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  // 3.Error 400
  if (quiz.intrash === false) {
    return { error: 'The quiz is not in trash.', status: 400 };
  }
  if (UsedQuizName(quiz.owner, quiz.name)) {
    return { error: 'The quiz name is used by another quiz', status: 400 };
  }
  // Success 200
  quiz.timeLastEdited = getNow();
  quiz.intrash = false;
  return {};
}

/**
 * Purpose: Empty the trash
 *
 * @param {string} token - a valid sessionId
 * @param {string array} quizIds - is passed via a query, a string representing
 * a JSONified array of quiz id numbers, example: [3, 4, 5, 6, 7]
 *
 * @returns {ErrorObject} - 400 if one or more of the Quiz IDs is not currently in the trash
 * @returns {ErrorObject} - 401 if token is empty of invalid
 * @returns {ErrorObject} - 403  if valid token is provided but one of of QuizId is not owner
 * @returns {} - 200 on success removing all quiz
 */
export function adminQuizTrashEmpty(token: string, quizIds: string): Record<string, never> | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }
  // 2.Error 403
  const QuizIdsArray = JSON.parse(quizIds);
  if (!Array.isArray(QuizIdsArray) || !QuizIdsArray.every(id => typeof id === 'number')) {
    return { error: 'quizIds must be numbers', status: 403 };
  }
  for (const quizId of QuizIdsArray) {
    const quiz = findQuizId(quizId);
    if (!quiz || quiz.owner !== validToken.userId) {
      return { error: 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner', status: 403 };
    }
  }
  // 3.Error 400 - One or more of the Quiz IDs is not currently in the trash
  for (const quizId of QuizIdsArray) {
    const quiz = findQuizId(quizId);
    if (!quiz || quiz.intrash === false) {
      return { error: 'One or more of the Quiz IDs is not currently in the trash', status: 400 };
    }
  }
  // Success 200 - Permanent removal of quiz in trash using .splice
  const data: DataStore = getData();
  QuizIdsArray.forEach(quizId => {
    const index = data.quizzes.findIndex(q => q.quizId === quizId);
    if (index !== -1) { data.quizzes.splice(index, 1); }
  });
  setData(data);
  return {};
}
