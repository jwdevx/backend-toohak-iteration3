import HTTPError from 'http-errors';
import { ErrorObject, Quizzes, DataStore, Questions, Users } from './dataStore';
import { setData, getData } from './dataStore';
import {
  findSessionId, findUserId, getNow, randomIdGenertor,
  invalidQuizName, invalidQuizNameLength, UsedQuizName,
  invalidDescriptionLength, findQuizId, matchQuizIdAndAuthor, EndState,
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
  throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 400
  if (invalidQuizName(name)) throw HTTPError ( 400,'The name is not valid');
  if (!name || invalidQuizNameLength(name)) {
    throw HTTPError(400,'The name is either too long or too short');
  }
  if (UsedQuizName(validToken.userId, name)) {
    throw HTTPError (400,'The name has already used for the quiz you created before');
  }
  // Note: empty strings are OK
  if (invalidDescriptionLength(description)) {
    throw HTTPError(400,'The description is too long');
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
    duration: 0,
    thumbnailURL: '',
  };
  data.quizzes.push(quiz);
  setData(data);
  return {
    quizId: quiz.quizId,
  };
}

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401,'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError(403,'Quiz ID does not refer to a quiz that this user owns.');
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

//! ---------------------   ITERATION 3 SPECIFIC  ------------------------------

export function adminQuizInfoV2(token: string, quizId: number): {
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401,'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError(403,'Quiz ID does not refer to a quiz that this user owns.');
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
    duration: quiz.duration,
    thumbnailUrl:quiz.thumbnailURL
  };
  return quizInfo;
}



//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError (403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  if (invalidQuizName(name)) throw HTTPError ( 400,'The name is not valid');
  if (!name || invalidQuizNameLength(name)) {
    throw HTTPError(400,'The name is either too long or too short');
  }
  if (UsedQuizName(validToken.userId, name)) {
    throw HTTPError(400, 'The name has already used for the quiz you created before');
  }
  // Success 200
  quiz.name = name;
  const updatedTime = Math.floor(new Date().getTime() / 1000);
  quiz.timeLastEdited = updatedTime;
  setData(data);
  return {};
}

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError (403,'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400, Note: empty strings are OK
  if (invalidDescriptionLength(description)) {
    throw HTTPError(400,'The description is too long');
  }
  // Success 200
  quiz.description = description;
  quiz.timeLastEdited = Math.floor(new Date().getTime() / 1000);
  setData(data);
  return {};
}

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError(403,'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400 - Check whether userEmail is valid
  const newQuizOwner: Users | undefined = data.users.find(u => u.email === userEmail);
  if (!newQuizOwner) throw HTTPError(400,'userEmail is not a real user');
  // Check Email
  if (findUserId(validToken.userId).email === userEmail) {
    throw HTTPError(400,'userEmail is the current logged in user');
  }
  // Check Name
  if (data.quizzes.some(q => q.owner === newQuizOwner.userId && q.name === quiz.name && q.intrash === false)) {
    throw HTTPError(400,'Quiz ID refers to a quiz that has an invalid name');
  }

  // Success 200
  quiz.owner = newQuizOwner.userId;
  setData(data);
  return {};
}


//! ---------------------   ITERATION 3 SPECIFIC  ------------------------------

/* 
export function adminQuizThumbnailUpdate(
  quizId: number,
  token: string,
  imgUrl: string): ErrorObject | Record<string, never> {
  // 1.Error 401
  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError (403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
if(!isValidUrl(imgUrl)){throw HTTPError(400,'File type or Url is invalid)};
  // Success 200
  quiz.thumbnailURL = imgUrl;
  const updatedTime = Math.floor(new Date().getTime() / 1000);
  quiz.timeLastEdited = updatedTime;
  setData(data);
  return {};
}
*/
// =============================================================================
// ============================ QUIZ TRASH =====================================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401,'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError( 403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // Success 200
  quiz.timeLastEdited = Math.floor(new Date().getTime() / 1000);
  quiz.intrash = true;
  return {};
}

//! ---------------------   ASKING ON FORUM IF WE NEED TO  ---------------------
export function adminQuizRemoveV2(token: string, quizId: number): Record<string, never> {
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401,'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.'); 
  }
  // 3.Error 400
  if(!EndState(quizId)){
    throw HTTPError(400,'Any session for this quiz is not in END state.');
  } 
  // Success 200
  quiz.timeLastEdited = Math.floor(new Date().getTime() / 1000);
  quiz.intrash = true;
  return {};
}

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
/**
 * View the quizzes in trash
 */
export function adminQuizTrashView(token: string): {quizzes: QuizSummary[]} | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
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

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
/**
 * Restore a quiz from trash
 */
export function adminQuizTrashRestore(token: string, quizId: number): Record<string, never> | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  if (!findQuizId(quizId)) {
    throw HTTPError(403,'The quiz does not exist.');
  }
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (!quiz || isNaN(quizId)) {
    throw HTTPError(403,'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  if (quiz.intrash === false) {
    throw HTTPError(400,'The quiz is not in trash.');
  }
  if (UsedQuizName(quiz.owner, quiz.name)) {
    throw HTTPError(400, 'The quiz name is used by another quiz');
  }
  // Success 200
  quiz.timeLastEdited = getNow();
  quiz.intrash = false;
  return {};
}

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
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
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError (401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const QuizIdsArray = JSON.parse(quizIds);
  if (!Array.isArray(QuizIdsArray) || !QuizIdsArray.every(id => typeof id === 'number')) {
    throw HTTPError(403,'quizIds must be numbers');
  }
  for (const quizId of QuizIdsArray) {
    const quiz = findQuizId(quizId);
    if (!quiz || quiz.owner !== validToken.userId) {
      throw HTTPError(403,'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner');
    }
  }
  // 3.Error 400 - One or more of the Quiz IDs is not currently in the trash
  for (const quizId of QuizIdsArray) {
    const quiz = findQuizId(quizId);
    if (!quiz || quiz.intrash === false) {
      throw HTTPError(400,'One or more of the Quiz IDs is not currently in the trash');
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
