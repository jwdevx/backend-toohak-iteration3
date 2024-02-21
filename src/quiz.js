/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId - the authenticated user ID.
 * @returns {{quizzes: json}} An json object containing the quizzes with their ID and name.
 */
function adminQuizList( authUserId ){
    return {
        quizzes: [
            {
              quizId: 1,
              name: 'My Quiz',
            }
          ]
    }
}
