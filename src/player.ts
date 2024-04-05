import HTTPError from 'http-errors';
import {
  Questions, state,
  // player, questionResults, Session,
} from './dataStore';
import {
  // getNow,
  findAtQuestionMetadata, findQuizSession
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
/*
  // Find Session
  const session = findQuizSession(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');

  // Find Current Question to compare in metadata
  const question = findAtQuestionMetadata(session, questionPosition);
  if (!question) throw HTTPError(400, 'Error question position is not valid for this session!');

  // An answer can be re-submitted once first selection is made, as long as game is in the right state
  // If timeout or GO_TO_ANSWER, throw error
  if (session.state !== state.QUESTION_OPEN) throw HTTPError(400, 'Error session is not in QUESTION_OPEN state!');
  if (questionPosition > session.atQuestion) throw HTTPError(400, 'Error session is not yet up to this question!');

  // Iterate through idSubmit to each answerId in question.answers,
  // stop until found first element for which the provided testing function returns true
  const invalidAnswerId = answerIds.some(idSubmit => !question.answers.some(a => a.answerId === idSubmit));
  if (invalidAnswerId) throw HTTPError(400, 'Error one or more answer IDs are not valid for this particular question!');
  if (new Set(answerIds).size !== answerIds.length) throw HTTPError(400, 'Error there are duplicate answer IDs provided!');
  if (answerIds.length < 1) throw HTTPError(400, 'Error less than 1 answer ID was submitted!');

  // Find player
  const player = session.players.find(p => p.playerId === playerId);
  const playerAnswer = player.answers[questionPosition - 1];

  // Valid for first time and resubmit
  if (session.startTime === 0) throw HTTPError(400, 'Cannot calculate player answer time!');
  const answerTime = calculateAnswerTime(session);
  // TODO Players who answer the question at the exact same time results in undefined behaviour.
  const isCorrect = analyzeAnswer(question, answerIds);
  const atQuestion = session.questionResults[questionPosition - 1];

  // Success 200 case 1 - if no answer yet, can answer first time
  if (playerAnswer.answerIds.length === 0) {
    playerAnswer.answerIds = answerIds;
    playerAnswer.answerTime = answerTime; // TODO double check?

    if (isCorrect) {
      playerAnswer.correct = true;
      pushNewQuestionResults(player, session, question);
      playerAnswer.score = calculateScore(player, session, question, atQuestion);
      player.totalScore += playerAnswer.score;
    } else {
      playerAnswer.correct = false;
    }
  }
  // Success 200 case 2 - if already answer first time can resubmit Answer
  if (playerAnswer.answerIds.length > 0) {
    playerAnswer.answerIds = [];
    playerAnswer.answerIds = answerIds; // TODO can you do this in js ?? assign array to array?
    playerAnswer.answerTime = answerTime;

    if (isCorrect) {
      playerAnswer.correct = true;
      updateCorrectAnswerQuestionResults(player, session, question, atQuestion);
      const temp = playerAnswer.score;
      playerAnswer.score = calculateScore(player, session, question, atQuestion);
      player.totalScore = player.totalScore - temp + playerAnswer.score;
    } else {
      playerAnswer.correct = false;
      const temp = playerAnswer.score;
      playerAnswer.score = 0;
      player.totalScore -= temp;
      updateWrongAnswerQuestionResults(player, session, question);
    }
  }
  */
  return {};
}
/*
// Calculate AnswerTime in seconds
function calculateAnswerTime(session: Session): number {
  return session.startTime - getNow();
}

// Analyze Player Answers
function analyzeAnswer(question: Questions, answerIds: number[]):boolean {
  const validAnswers: number[] = question.answers
    .filter(answer => answer.correct === true)
    .map(answer => answer.answerId);
  const sortedValidAnswers = validAnswers.sort((a, b) => a - b);
  const sortedAnswerIds = answerIds.sort((a, b) => a - b);

  if (sortedValidAnswers.length !== sortedAnswerIds.length) {
    return false;
  }
  for (let i = 0; i < sortedValidAnswers.length; i++) {
    if (sortedValidAnswers[i] !== sortedAnswerIds[i]) {
      return false;
    }
  }
  return true;
}

// Calculate Score
function calculateScore(session: Session, question: Questions, atQuestion: questionResults): number {
  const questionPoints = question.point;
  const playerNameIndex = atQuestion.playersCorrectList.indexOf(player.playerName);
  return Math.round(questionPoints / playerNameIndex);
}

// Push new Question Results for the given player - if answer is correct
function pushNewQuestionResults(
  player: player, session: Session, question: Questions, atQuestion: questionResults): Record<string, never> {
  // atQuestion.questionId = question.questionId;
  atQuestion.playersCorrectList.push(player.playerName);
  // TODO atQuestion.averageAnswerTime
  // TODO atQuestion.percentCorrect

}

// Update Question Results for the given player - if answer is correct
function updateCorrectAnswerQuestionResults(
  player: player, session: Session, question: Questions, atQuestion: questionResults): Record<string, never> {
  // atQuestion.questionId = question.questionId;
  const playerNameIndex = atQuestion.playersCorrectList.indexOf(player.playerName);
  atQuestion.playersCorrectList.splice(playerNameIndex, 1);
  atQuestion.playersCorrectList.push(player.playerName);
  // TODO atQuestion.averageAnswerTime
  // TODO atQuestion.percentCorrect
}

// Update Question Results for the given player - if answer is wrong
function updateWrongAnswerQuestionResults(
  player: player, session: Session, question: Questions, atQuestion: questionResults): Record<string, never> {
  // atQuestion.questionId = question.questionId;
  const playerNameIndex = atQuestion.playersCorrectList.indexOf(player.playerName);
  atQuestion.playersCorrectList.splice(playerNameIndex, 1);
  // TODO atQuestion.averageAnswerTime
  // TODO atQuestion.percentCorrecct
}
*/

/*
To determine the score a user receives for a particular question:

If they do not get the question correct, they receive a score of 0.

If they do get the question correct, the score they received is P*S where P
    is the points for the question, and S is the scaling factor of the question.

The scaling factor of the question is 1/N, where N is the number of how quickly
    they correctly answered the question. N = 1 is first person who answered correctly,
    N = 2 is second person who answered correctly, N = 3 is third person who answered correctly, etc.

Players who answer the question at the exact same time results in undefined behaviour.

For multiple-correct-answer questions, people need to select all the correct answers
    (no less, no more) to be considered having gotten the question correct.

When returned through any of the inputs:

All scores are rounded to the nearest integer.
If there are players with the same final score, they share the same rank,
    e.g. players scoring 5, 3, 3, 2, 2, 1 have ranks 1, 2, 2, 4, 4, 6.
*/

/**
 * To do comment
 */
export function playerQuestionResults(playerId: number, questionPosition: number): Record<string, never> {
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
export function playerFinalResults(playerId: number): Record<string, never> {
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
