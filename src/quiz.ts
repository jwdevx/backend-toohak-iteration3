
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



import { setData, getData } from './dataStore';
import { format } from 'date-fns';
import { findUserId, invalidQuizName, invalidQuizNameLength, UsedQuizName, invalidDescriptionLength, findQuizId, matchQuizIdAndAuthor } from './helper';
/**
* Given basic details about a new quiz, create one for the logged in user.
*
* @param {number} authUserId - the authenticated user ID.
* @param {string} name - the name of the quiz
* @param {string} description - the description of the quiz
* @returns {{quizID: number}} An object containing the authenticated quiz ID.
*/
function adminQuizCreate(authUserId, name, description) {
  // Checks for valid parameters:
  if (!authUserId || !name || (description === null || description === undefined)) {
    return { error: 'One or more missing parameters' };
  }

  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };
  if (invalidQuizName(name)) return { error: 'The name is not valid.' };
  if (invalidQuizNameLength(name)) return { error: 'The name is either too long or too short.' };
  if (UsedQuizName(name, authUserId)) return { error: 'The quiz name is already been used.' };
  if (invalidDescriptionLength(description)) return { error: 'The description is too long.' };

  const data = getData();
  const ID = data.quizzes.length + 1;

  const currentTime = new Date();
  const createdTime = format(currentTime, 'MMMM d, yyyy h:mm a'); // "h:mm a" format includes hours, minutes, and AM/PM
  const quiz = {
    quizId: ID,
    name: name,
    timeCreated: createdTime,
    timeLastEdited: createdTime,
    description: description,
    numQuestions: 0,
    owner: authUserId,
    questions: [],
  };
  data.quizzes.push(quiz);
  setData(data);
  return {
    quizId: ID
  };
}
export { adminQuizCreate };
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId - the authenticated user ID.
 * @returns {{quizzes: json}} An json object containing the quizzes with their ID and name.
 */
function adminQuizList(authUserId) {
  // checking for valid parameters
  if (!authUserId) return { error: 'One or more missing parameters' };
  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };

  const data = getData();
  const quizarray = [];
  for (const quiz of data.quizzes) {
    if (quiz.owner === authUserId) {
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
function adminQuizRemove(authUserId, quizId) {
  // checking for valid parameters
  if (!authUserId || !quizId) return { error: 'One or more missing parameters.' };
  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };
  if (!findQuizId(quizId)) return { error: 'Quiz ID does not refer to a valid quiz.' };
  if (!matchQuizIdAndAuthor(authUserId, quizId)) return { error: 'Quiz ID does not refer to a quiz that this user owns.' };

  const data = getData();

  // finds the index in the quiz array which contains the quiz we want to remove
  const quiz_index = data.quizzes.findIndex(quiz => quiz.owner === authUserId && quiz.quizId === quizId);

  if (quiz_index !== -1) {
    // deletes the subsequent index and updates data
    data.quizzes.splice(quiz_index, 1);
    setData(data);
  }
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
  const data = getData();

  // checking if the user Id is valid
  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };

  // checking if the quiz Id is valid
  if (!findQuizId(quizId)) return { error: 'The quiz id is not valid.' };

  // checking if the quiz name is valid
  if (invalidQuizName(name)) return { error: 'The name is not valid.' };

  // checking if the quiz name length is valid
  if (invalidQuizNameLength(name)) return { error: 'The name is either too long or too short.' };

  // checking  if the quiz name was used before
  if (UsedQuizName(name, authUserId)) return { error: 'The quiz name is already been used.' };

  // checking if the quiz is owned by user
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
  // checking if the user Id is valid
  if (!findUserId(authUserId)) return { error: 'The user id is not valid.' };

  // checking if the quiz Id is valid
  if (!findQuizId(quizId)) return { error: 'The quiz id is not valid.' };

  // checking if the quiz is owned by user
  if (!matchQuizIdAndAuthor(authUserId, quizId)) return { error: 'Quiz belongs to a different user.' };

  // checking if thes Description is too long
  if (invalidDescriptionLength(description)) return { error: 'The description is too long.' };
  const currentTime = new Date();
  const updatedTime = format(currentTime, 'MMMM d, yyyy h:mm a'); // "h:mm a" format includes hours, minutes, and AM/PM
  quiz.description = description;
  quiz.timeLastEdited = updatedTime;
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
