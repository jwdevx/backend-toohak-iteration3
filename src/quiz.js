/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId - the authenticated user ID.
 * @returns {{quizzes: json}} An json object containing the quizzes with their ID and name.
 */
function adminQuizList(authUserId) {
  return {
      quizzes: [
          {
            quizId: 1,
            name: 'My Quiz',
          }
        ]
  }
}

/**
* Provide a list of all quizzes that are owned by the currently logged in user.
*
* @param {number} authUserId - the authenticated user ID.
* @param {string} name - the name of the quiz
* @param {string} description - the description of the quiz
* @returns {{quizID: number}} An object containing the authenticated quiz ID.
*/
function adminQuizCreate(authUserId, name, description) {
  return {
      quizId: 2
  }
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