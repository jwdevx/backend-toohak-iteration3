import HTTPError from 'http-errors';
import {
  Questions, state,
  player, questionResults, Session,
} from './dataStore';
import {
  findAtQuestionMetadata, findQuizSession, hasInvalidOrDuplicateAnswerId,
  calculateAnswerTime, analyzeAnswer, processAnswerSubmission
} from './helper';
import { message } from './dataStore';



/**
 * To do comment
 */
export function playerJoin(sessionId: number, name: string): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}



/**
 * To do comment
 */
export function playerStatus(playerId: number): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200
  return {};
}


/**
 * Get the information about a question that the guest player is on. Question position starts at 1
 * @param {number} playerId - an encoded session ID of the user
 * @param {number} quizId - the authenticated quiz ID.
 * @returns {Questions} Questions containing the questions at the question position
 */

export function playerQuestionPositionInfo(playerId: number, questionPosition: number): Questions {
  const session = findQuizSession(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');

  const question = findAtQuestionMetadata(session, questionPosition);
  if (!question) throw HTTPError(400, 'Error question position is not valid for this session!');
  if (session.atQuestion !== questionPosition) {
    throw HTTPError(400, 'Error session is not currently on this question!');
  }
  if (session.state === state.LOBBY || session.state === state.QUESTION_COUNTDOWN || session.state === state.END) {
    throw HTTPError(400, 'Error session is in LOBBY, QUESTION_COUNTDOWN, or END state!');
  }
  const questionPositionInfo = {
    questionId: question.questionId,
    question: question.question,
    duration: question.duration,
    thumbnailUrl: question.thumbnailUrl,
    points: question.points,
    answers: question.answers,
  };
  return questionPositionInfo;
}

/**
 * Allow the current player to submit answer(s) to the currently active question.
 * Question position starts at 1.
 * Note: An answer can be re-submitted once first selection is made, as long as game is in the right state
 *
 * @param {number} playerId - an encoded session ID of the user
 * @param {number} questionPosition - the requested position of question to submit answer
 * @param {Array} answerIds - a number array
 * @returns {} Null if it is successfull else throw error
 */
export function playerQuestionAnswerSubmit(
  playerId: number, questionPosition: number, answerIds: number[]): Record<string, never> {

  // Find Session
  const session = findQuizSession(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');

  // Find Current Question to compare in metadata
  const question = findAtQuestionMetadata(session, questionPosition);
  if (!question) throw HTTPError(400, 'Error question position is not valid for this session!');

  // An answer can be re-submitted once first selection is made, as long as game is in the right state
  if (session.state !== state.QUESTION_OPEN) throw HTTPError(400, 'Error session is not in QUESTION_OPEN state!');
  if (questionPosition > session.atQuestion) throw HTTPError(400, 'Error session is not yet up to this question!');

  // Checking for invalid or duplicate answer IDs
  const invalidOrDuplicateAnswerId = hasInvalidOrDuplicateAnswerId(answerIds, question.answers);
  if (invalidOrDuplicateAnswerId) throw HTTPError(400, 'Error one or more answer IDs are not valid or duplicated!');
  if (answerIds.length < 1) throw HTTPError(400, 'Error less than 1 answer ID was submitted!');
  return processAnswerSubmission(playerId, session, question, answerIds, questionPosition);
}


/**
 * To do comment
 */
export function playerQuestionResults(playerId: number, questionPosition: number): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200
  /*
  {
  questionId	        integer
                      example: 5546
  playersCorrectList	[This array is ordered in ascending order of player name
                      string
                      example: Hayden
                      List of the name of players
                      ]
  averageAnswerTime	integer
                      example: 45
                      The average answer time for the question across all players who attempted the question, rounded to the nearest second. 
                      If no answers are submitted then the value is 0.

  percentCorrect	    integer
                      example: 54
                      A percentage rounded to the nearest whole number that describes the percentage of players that got the question completely correct.

  }
  */
  return {};
}


/**
 * To do comment
 */
export function playerFinalResults(playerId: number): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200
  /*
  {
  usersRankedByScore	[
                      A list of all users who played ranked in descending order by score
                      All scores are rounded to the nearest integer.
                      If there are players with the same final score, they share the same rank, e.g. players scoring 5, 3, 3, 2, 2, 1 have ranks 1, 2, 2, 4, 4, 6.
                      {
                      name	    string
                                  example: Hayden
                                  The name of the player that is a top ranker
                      score	    number
                                  example: 45
                                  The final score for the user
                      }]
  questionResults     questionId	        integer
                                          example: 5546
                      playersCorrectList	[
                                          This array is ordered in ascending order of player name
                                          string
                                          example: Hayden
                                          List of the name of players
                                          ]
                      averageAnswerTime	integer
                                          example: 45
                                          The average answer time for the question across all players who attempted the question, rounded to the nearest second. 
                                          If no answers are submitted then the value is 0.

                      percentCorrect	    integer
                                          example: 54
                                          A percentage rounded to the nearest whole number that describes the percentage of players 
                                          that got the question completely correct.
  }
  */
  return {};
}


/**
 * To do comment
 */
export function playerReturnAllChat(playerId: number): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}

/**
 * To do comment
 */
export function playerSendChat(playerId: number, message: message): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}

//------------------------------------------------------------------------------
