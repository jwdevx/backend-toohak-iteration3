import { setData, getData } from "./dataStore"
import { format } from "date-fns";
import {findUserId, invalidQuizName, invalidQuizNameLength,UsedQuizName, invalidDescriptionLength, findQuizId, matchQuizIdAndAuthor} from "./helper";
/**
* Given basic details about a new quiz, create one for the logged in user.
*
* @param {number} authUserId - the authenticated user ID.
* @param {string} name - the name of the quiz
* @param {string} description - the description of the quiz
* @returns {{quizID: number}} An object containing the authenticated quiz ID.
*/
function adminQuizCreate(authUserId, name, description) {
    if  (!authUserId || !name || (description === null || description === undefined)) {
      return { error: 'One or more missing parameters' };
    }
    const data = getData();
    const ID = data.quizzes.length + 1;
    if (!findUserId(authUserId)) {
      return {
        error: 'The user id is not valid.'
      }
    }

    if (invalidQuizName(name)) {
      return {
        error: 'The name is not valid.'
      }
    }

    if (invalidQuizNameLength(name)) {
      return {
        error: "The name is either too long or too short."
      }
    }
    if (UsedQuizName(name)) {
      return {
        error: 'The quiz name is already been used.'
      }
    }
    if (invalidDescriptionLength(description)) {
      return {
        error: 'The description is too long.'
      }
    }
    const currentTime = new Date();
    const createdTime = format(currentTime, "MMMM d, yyyy h:mm a"); // "h:mm a" format includes hours, minutes, and AM/PM
    const quiz = {
      quizId: ID,
      name: name,
      timeCreated: createdTime,
      timeLastEdited: createdTime,
      description: description,
      numQuestions: 0,
      owner: authUserId,
      questions: [],
    }
    data.quizzes.push(quiz);
    setData(data);
    return {
        quizId: ID
    }
}
export { adminQuizCreate }
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId - the authenticated user ID.
 * @returns {{quizzes: json}} An json object containing the quizzes with their ID and name.
 */
function adminQuizList(authUserId) {
  if  (!authUserId) {
    return { error: 'One or more missing parameters' };
  }
  if (!findUserId(authUserId)) {
    return {
      error: 'The user id is not valid.'
    }
  }
  const data = getData();
  const quizzes = data.quizzes.find(quiz => quiz.owner === authUserId)
  if (!quizzes) {
    return {
      error: 'The user does not own any quizzes.'
    }
  }
  const quizarray = [];
  for (const quiz of data.quizzes) {
    if (quiz.owner === authUserId) {
      quizarray.push({
        quizid: quiz.quizId,
        name: quiz.name,
      })
    }
  }
  return {
    quizzes: quizarray,
  };
}

export {adminQuizList}
/**
 * Removes the quiz
 *
 * @param {number} authUserId - the authenticated user ID.
 * @param {number} quizID - the authenticated user ID.
 * @returns {} nothing
 */
function adminQuizRemove(authUserId, quizId) {
  if  (!authUserId || !quizId) {
    return { error: 'One or more missing parameters' };
  }
  if (!findUserId(authUserId)) {
    return {
      error: 'The user id is not valid.'
    }
  }
  if (!findQuizId(quizId)) {
    return { error: 'Quiz ID does not refer to a valid quiz.'}
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.'}
  }
  const data = getData();
  let quiz_index = data.quizzes.findIndex(quiz => quiz.owner === authUserId && quiz.quizId === quizId);
  if (quiz_index !== -1) {
    data.quizzes.splice(quiz_index, 1);
    setData(data);
  }
  return {}
}
export {adminQuizRemove};
/**
*Update the name of the relevant quiz.
*
* @param {number} authUserId - the authenticated user ID.
* @param {number} quizId- the authenticated quiz ID.
* @param {string} name - the name of the quiz
* @return{{}}empty object
*/
function adminQuizNameUpdate(authUserId, quizId, name){
  const data = getData();
  
  
  //checking if the user Id is valid
  if (!findUserId(authUserId)) {
    return {
      error: 'The user id is not valid.'
    }
  }
  //checking if the quiz Id is valid
  if (!findQuizId(quizId)) {
    return {
      error: 'The quiz id is not valid.'
    }
  }
  //checking if the quiz name is valid
  if (invalidQuizName(name)) {
    return {
      error: 'The name is not valid.'
    }
  }

  //checking if the quiz name length is valid
  if (invalidQuizNameLength(name)) {
    return {
      error: "The name is either too long or too short."
    }
  }
  //checking  if the quiz name was used before
  if (UsedQuizName(name)) {
    return {
      error: 'The quiz name is already been used.'
    }
  }
    //checking if the quiz is owned by user
    if (!matchQuizIdAndAuthor(authUserId,quizId)) {
      return {
        error: 'Quiz belongs to a different user.'
      }
    }
    //updating the quiz name
    const quiz = findQuizId(quizId);
    quiz.name=name;
    setData(data);
    return{};
  
}
export {adminQuizNameUpdate}
/**
*Update the description of the relevant quiz.
*
* @param {number} authUserId - the authenticated user ID.
* @param {number} quizId- the authenticated quiz ID.
* @param {string} description - the description of the quiz 
* @return{{}}empty object
*/
function adminQuizDescriptionUpdate(authUserId, quizId, description){
  const data = getData();
  const quiz = findQuizId(quizId);
  //checking if the user Id is valid
  if (!findUserId(authUserId)) {
    return {
      error: 'The user id is not valid.'
    }
  }
  //checking if the quiz Id is valid
  if (!findQuizId(quizId)) {
    return {
      error: 'The quiz id is not valid.'
    }
  }
  //checking if the quiz is owned by user
  if (!matchQuizIdAndAuthor(authUserId,quizId)) {
    return {
      error: 'Quiz belongs to a different user.'
    }
  }
  //checking if thes Description is too long
  if (invalidDescriptionLength(description)) {
    return {
      error: 'The description is too long.'
    }
  }
  quiz.description=description;
  setData(data);
  

  return{};
}

export {adminQuizDescriptionUpdate}

/**
 * provides information on the quiz
 *
 * @param {number} authUserId - the authenticated user ID.
 * @param {number} quizID - the authenticated quiz ID.
 * @returns {json} A json object containing the quiz info with their quizId,
 * name, timeCreated, timeLastEdited, description.
 */
function adminQuizInfo(authUserId, quizId) {
  if  (!authUserId || !quizId) {
    return { error: 'One or more missing parameters' };
  }
  if (!findUserId(authUserId)) {
    return {
      error: 'The user id is not valid.'
    }
  }
  if (!findQuizId(quizId)) {
    return { error: 'Quiz ID does not refer to a valid quiz.'}
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.'}
  }
  const data = getData();
  let quizInfo = {};
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
export{adminQuizInfo};