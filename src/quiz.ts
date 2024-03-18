
/* eslint-disable */
// @ts-nocheck
//TODO REMOVE THIS 2 COMMENTS ABOVE when this file is lintsafe and typesafe

/*


currently there is this 15  number of errors in typecheck in this file:
	15  src/quiz.ts:27

Please run:
	npm test
	npm run lint
	npm run tsc

 /import/ravel/5/z5494973/comp1531/project-backend/src/quiz.ts
1:1  error  Trailing spaces not allowed                                      no-trailing-spaces
2:1  error  Too many blank lines at the beginning of file. Max of 1 allowed  no-multiple-empty-lines
92:9  error  Identifier 'quiz_index' is not in camel case                     camelcase
94:7  error  Identifier 'quiz_index' is not in camel case                     camelcase

*/

//TODO REMOVE ALL COMMENTS ABOVE -----------------------------------------------

import { ErrorObject,  Quizzes } from './dataStore';
import { setData, getData } from './dataStore';
import {
  findSessionId,
  findUserId,
  invalidQuizName,
  invalidQuizNameLength,
  UsedQuizName,
  invalidDescriptionLength,
  findQuizId,
  matchQuizIdAndAuthor,
  checkQuizInTrash
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

  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));  
  if (!token || isNaN(sessionId) ) {
    return { error: 'Token is empty or not provided', status: 401,};
  } 
  const validToken = findSessionId(sessionId);  
  if (!validToken) {
    return {
      error: 'Token is invalid (does not refer to valid logged in user session)', status: 401,
    };
  }   
  if (invalidQuizName(name)) {
    return { error: 'The name is not valid', status: 400 };
  }
  if (invalidQuizNameLength(name)) {
    return { error: 'The name is either too long or too short', status: 400 };
  }
  if (UsedQuizName(validToken.userId, name)) {
    return { error: 'The name has already used for the quiz you created before', status: 400 };
  }       
  if (invalidDescriptionLength(description)) {
    return { error: 'The description is too long', status: 400 };
  }   
  const createdTime = Math.floor(new Date().getTime() / 1000);
  const quiz:  Quizzes = {
    quizId: data.quizzes.length + 1,
    name: name,
    timeCreated: createdTime,
    timeLastEdited: createdTime,
    description: description,
    numQuestions: 0,
    owner: validToken.userId,
    questions: [],
    intrash: false
  };
  
  data.quizzes.push(quiz);
  setData(data);
  return {
    quizId: quiz.quizId,
  };
}

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId - the authenticated user ID.
 * @returns {{quizzes: json}} An json object containing the quizzes with their ID and name.
 */
function adminQuizList(token: string) : {quizzes:[]} | ErrorObject{
  // checking for valid parameters
  const data: DataStore = getData();

  const sessionId = parseInt(decodeURIComponent(token));  
  if (!token || isNaN(sessionId) ) {
    return { error: 'Token is empty or not provided', status: 401,};
  } 
  const validToken = findSessionId(sessionId);  
  if (!validToken) {
    return {
      error: 'Token is invalid (does not refer to valid logged in user session)', status: 401,
    };
  }   
  const quizarray = [];
  for (const quiz of data.quizzes) {
    if (quiz.owner === validToken.userId && quiz.intrash == false) {
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

export { adminQuizList };
/**
 * Removes the quiz
 *
 * @param {number} authUserId - the authenticated user ID.
 * @param {number} quizID - the authenticated user ID.
 * @returns {} nothing
 */
function adminQuizRemove(token: string, quizId: number) : {} | ErrorObject {
  // checking for valid parameters
  const sessionId = parseInt(decodeURIComponent(token));  
  if (!token || isNaN(sessionId) ) {
    return { error: 'Token is empty or not provided', status: 401 };
  } 
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return {
      error: 'Token is invalid (does not refer to valid logged in user session)', status: 401,
    };
  }  
  const authUserId = validToken.userId
  if (!findQuizId(quizId)) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 401};
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.' , status: 403};
  }
  const data: DataStore = getData();
  const quiz = data.quizzes.find(quiz => quiz.owner === authUserId && quiz.quizId === quizId);
  if (quiz.intrash) {
    return { error: 'Quiz is already been removed.', status: 403}
  }
  quiz.intrash = true
  return {};
}
export { adminQuizRemove };
/**
*Update the name of the relevant quiz.
*
* @param {number} authUserId - the authenticated user ID.
* @param {number} quizId- the authenticated quiz ID.
* @param {string} name - the name of the quiz
* @return{{}}empty object
*/
function adminQuizNameUpdate(authUserId, quizId, name) {
  const data: DataStore = getData();

  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };
  if (!findQuizId(quizId)) return { error: 'The quiz id is not valid.' };
  if (invalidQuizName(name)) return { error: 'The name is not valid.' };
  if (invalidQuizNameLength(name)) return { error: 'The name is either too long or too short.' };


  const sessionId = parseInt(decodeURIComponent(token));  
  if (!token || isNaN(sessionId) ) {
    return { error: 'Token is empty or not provided', status: 401,};
  } 
  const validToken = findSessionId(sessionId);  
  if (!validToken) {
    return {
      error: 'Token is invalid (does not refer to valid logged in user session)',
      status: 401,
    };
  }     
  if (UsedQuizName(validToken.userId, name)) return { error: 'The quiz name is already been used.' };
  if (!matchQuizIdAndAuthor(authUserId, quizId)) return { error: 'Quiz belongs to a different user.' };

  // updating the quiz name
  const quiz = findQuizId(quizId);
  quiz.name = name;
  const currentTime = new Date();
  const updatedTime = format(currentTime, 'MMMM d, yyyy h:mm a'); // "h:mm a" format includes hours, minutes, and AM/PM
  quiz.timeLastEdited = updatedTime;
  setData(data);

  return {};
}
export { adminQuizNameUpdate };
/**
*Update the description of the relevant quiz.
*
* @param {number} authUserId - the authenticated user ID.
* @param {number} quizId- the authenticated quiz ID.
* @param {string} description - the description of the quiz
* @return{{}}empty object
*/
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  const data = getData();
  const quiz = findQuizId(quizId);

  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };
  if (!findQuizId(quizId)) return { error: 'The quiz id is not valid.' };
  if (!matchQuizIdAndAuthor(authUserId, quizId)) return { error: 'Quiz belongs to a different user.' };
  if (invalidDescriptionLength(description)) return { error: 'The description is too long.' };

  quiz.description = description;
  quiz.timeLastEdited = Math.floor(new Date().getTime() / 1000);
  setData(data);

  return {};
}

export { adminQuizDescriptionUpdate };

/**
 * provides information on the quiz
 *
 * @param {number} authUserId - the authenticated user ID.
 * @param {number} quizID - the authenticated quiz ID.
 * @returns {json} A json object containing the quiz info with their quizId,
 * name, timeCreated, timeLastEdited, description.
 */
function adminQuizInfo(authUserId, quizId) {
  // checking for valid parameters:
  if (!authUserId || !quizId) return { error: 'One or more missing parameters.' };
  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };
  if (!findQuizId(quizId)) return { error: 'Quiz ID does not refer to a valid quiz.' };
  if (!matchQuizIdAndAuthor(authUserId, quizId)) return { error: 'Quiz ID does not refer to a quiz that this user owns.' };

  const data = getData();
  let quizInfo = {};

  // scanning data to find the quiz in data.quizzes that authUserId owns
  for (const quiz of data.quizzes) {
    if (quiz.owner === authUserId && quiz.quizId === quizId) {
      quizInfo = {
        quizId: quiz.quizId,
        name: quiz.name,
        timeCreated: quiz.timeCreated,
        timeLastEdited: quiz.timeLastEdited,
        description: quiz.description,
      };
    }
  }
  return quizInfo;
}
export { adminQuizInfo };
