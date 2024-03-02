import { setData, getData } from "./dataStore"
import { format } from "date-fns";
import { 
  findUserId, invalidQuizName, invalidQuizNameLength, 
  UsedQuizName, invalidDescriptionLength, 
} from "./helper";
/**
* Given basic details about a new quiz, create one for the logged in user.
*
* @param {number} authUserId - the authenticated user ID.
* @param {string} name - the name of the quiz
* @param {string} description - the description of the quiz
* @returns {{quizID: number}} An object containing the authenticated quiz ID.
*/
function adminQuizCreate(authUserId, name, description) {
    const data = getData()
    const ID = data.quizzes.length + 1;
    if (!findUserId(authUserId)) return {
      error: 'The user id is not valid.'
    }
    if (invalidQuizName(name)) return {
      error: 'The name is not valid.'
    }
    if (invalidQuizNameLength(name)) {
      return {
        error: "The name is either too long or too short."
      }
    }
    if (UsedQuizName(name)) return {
      error: 'The quiz name is already been used.'
    }
    if (invalidDescriptionLength(description)) return {
      error: 'The description is too long.'
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
  const data = getData();
  const quizArray = [];
  for (const quiz of data.quizzes) {
    quizArray.push({
      quizId: quiz.quizId,
      name: quiz.name,
    });
  }
  return {
    quizzes: quizArray,
  };
}

/**
 * Removes the quiz
 *
 * @param {number} authUserId - the authenticated user ID.
 * @param {number} quizID - the authenticated user ID.
 * @returns {} nothing
 */
function adminQuizRemove(authUserId, quizId) {
  return {}
}

/**
*Update the name of the relevant quiz.
*
* @param {number} authUserId - the authenticated user ID.
* @param {number} quizId- the authenticated quiz ID.
* @param {string} name - the name of the quiz
* @return{{}}empty object
*/
function adminQuizNameUpdate(authUserId, quizId, name){
  return{}
}

/**
*Update the description of the relevant quiz.
*
* @param {number} authUserId - the authenticated user ID.
* @param {number} quizId- the authenticated quiz ID.
* @param {string} description - the description of the quiz 
* @return{{}}empty object
*/
function adminQuizDescriptionUpdate(authUserId, quizId, description){
  return{}
}

/**
 * provides information on the quiz
 *
 * @param {number} authUserId - the authenticated user ID.
 * @param {number} quizID - the authenticated quiz ID.
 * @returns {} empty object
 */
function adminQuizInfo(authUserId, quizId) {
  return {
    quizId: 1,
    name: 'My Quiz',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',
  }
}