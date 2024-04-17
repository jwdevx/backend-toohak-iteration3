import HTTPError from 'http-errors';
import {
  findQuizSessionViaPlayerId, findAtQuestionMetadata, randomIdGenertor,
  hasInvalidOrDuplicateAnswerId, calculateAnswerTime, analyzeAnswer, iterateQuestionResults, invalidMessageLength
} from './helper';
import { message, player, state, questionResults, Session, Questions, chat, getData, setData, DataStore } from './dataStore';

import { PlayerJoinReturn, playerQuestionPositionInfoReturn, EmptyObject, user, finalResults } from './returnInterfaces';
import { goNext } from './session';
/**
 * To DO.....!
 */
export function playerJoin(sessionId: number, name: string): PlayerJoinReturn {
  const data: DataStore = getData();
  const quizSession = data.sessions.find(
    (session) => session.sessionId === sessionId
  );
  if (!quizSession) {
    throw HTTPError(400, 'Session Id does not refer to a valid session.');
  }
  const existingPlayer = quizSession.players.find(
    (player) => player.playerName === name
  );
  if (existingPlayer) {
    throw HTTPError(
      400,
      'Name of user entered is not unique compared to other users who have already joined.'
    );
  }
  if (quizSession.state !== state.LOBBY) {
    throw HTTPError(400, 'Session is not in LOBBY state.');
  }
  const newPlayer: player = {
    playerId: randomIdGenertor(),
    playerName: name,
    totalScore: 0,
    answers: [],
  };
  if (quizSession.autoStartNum === 0) {
    quizSession.players.push(newPlayer);
    setData(data);
    return { playerId: newPlayer.playerId };
  }
  if (quizSession.autoStartNum === quizSession.numPlayers++) {
    goNext(quizSession);
  }
  quizSession.players.push(newPlayer);
  setData(data);
  return { playerId: newPlayer.playerId };
}
export function playerStatus(playerId: number) {
  const session = findQuizSessionViaPlayerId(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');
  return {
    state: session.state,
    numQuestions: session.metadata.numQuestions,
    atQuestion: session.atQuestion
  };
}
/**
 * Get the information about a question that the guest player is on. Question position starts at 1
 * @param {number} playerId - the player we want to view the question he/she is in
 * @param {number} quizId - the authenticated quiz ID.
 * @returns {playerQuestionPositionInfoReturn} Questions containing the questions at the question position
 */
export function playerQuestionPositionInfo(playerId: number, questionPosition: number): playerQuestionPositionInfoReturn {
  const session = findQuizSessionViaPlayerId(playerId);
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
    answers: question.answers.map(a => ({
      answerId: a.answerId,
      answer: a.answer,
      colour: a.colour
    })),
  };
  // const jsonString = JSON.stringify(questionPositionInfo, null, 2);
  return questionPositionInfo;
}

/**
 * Allow the current player to submit answer(s) to the currently active question.
 * Question position starts at 1.
 * Note: An answer can be re-submitted once first selection is made, as long as game is in the right state
 *
 * @param {number} playerId - an encoded session ID of the user
 * @param {number} questionPosition - the requested position of question to submit answer
 * @param {Array} answerIds - a number array of the answerId player chose
 * @returns {} Null if it is successfull else it throws error
 */
export function playerQuestionAnswerSubmit(
  playerId: number, questionPosition: number, answerIds: number[]): EmptyObject {
  // Find Session
  const session = findQuizSessionViaPlayerId(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');

  // Find Current Question to compare in metadata
  const question = findAtQuestionMetadata(session, questionPosition);
  if (!question) throw HTTPError(400, 'Error question position is not valid for this session!');

  // An answer can be re-submitted once first selection is made, as long as game is in the right state
  if (session.state !== state.QUESTION_OPEN) throw HTTPError(400, 'Error session is not in QUESTION_OPEN state!');
  if (questionPosition > session.atQuestion) throw HTTPError(400, 'Error session is not yet up to this question!');

  // Correct AnswerIds but for a different question
  if (questionPosition < session.atQuestion) throw HTTPError(400, 'Error answering wrong question');

  const invalidOrDuplicateAnswerId = hasInvalidOrDuplicateAnswerId(answerIds, question.answers);
  if (invalidOrDuplicateAnswerId) throw HTTPError(400, 'Error one or more answer IDs are not valid or duplicated!');
  if (answerIds.length < 1) throw HTTPError(400, 'Error less than 1 answer ID was submitted!');
  return processAnswerSubmission(playerId, session, question, answerIds, questionPosition);
}

// ------------  Helper Function for playerQuestionAnswerSubmit  --------------//
/**
 * Helper Function once all error is pass, we can process success 200
 *
 * Please note playerQuestionAnswerSubmit - uses 5 extra additional helper functions
 * that is located at helper.ts
 */
export function processAnswerSubmission(
  playerId: number, session: Session, question: Questions,
  answerIds: number[], questionPosition: number): Record<string, never> {
  // Find player
  const player = session.players.find(p => p.playerId === playerId);
  const playerAnswer = player.answers[questionPosition - 1];

  // Valid for first time and resubmit
  const answerTime = calculateAnswerTime(session);
  const isCorrect = analyzeAnswer(question, answerIds);
  const atQuestion = session.questionResults[questionPosition - 1];

  // Success 200 case 1 - if no answer yet, player can answer first time
  if (playerAnswer.answerIds.length === 0) {
    playerAnswer.answerIds = answerIds;
    playerAnswer.answerTime = answerTime;
    if (isCorrect) {
      playerAnswer.correct = true;
      atQuestion.playersCorrectList.push(player.playerName);
      playerAnswer.score = calculateScore(player, session, question, atQuestion);
      player.totalScore += playerAnswer.score;
    }
  } else {
    // Success 200 case 2 - if already answer first time player can resubmit Answer
    playerAnswer.answerIds = [];
    playerAnswer.answerIds = answerIds;
    playerAnswer.answerTime = answerTime;

    if (isCorrect) {
      updateAnswerQuestionResults(player, question, atQuestion, isCorrect);
      playerAnswer.correct = true;
      const temp = playerAnswer.score;
      playerAnswer.score = calculateScore(player, session, question, atQuestion);
      player.totalScore = player.totalScore - temp + playerAnswer.score;
    } else {
      updateAnswerQuestionResults(player, question, atQuestion, isCorrect);
      playerAnswer.correct = false;
      const temp = playerAnswer.score;
      playerAnswer.score = 0;
      player.totalScore -= temp;
    }
  }
  return {};
}
/**
 * Calculate Score, P / (num of ppl with correct answer before)
 */
// TODO jest tESt before forum Players who answer the question at the exact same time results in undefined behaviour.
function calculateScore(player: player, session: Session, question: Questions, atQuestion: questionResults): number {
  const questionPoints = question.points;
  const playerNameIndex = atQuestion.playersCorrectList.indexOf(player.playerName);
  return Math.round(questionPoints / (playerNameIndex + 1));
}

/**
 * Update Question Results for the given player - if answer is correct
 */
function updateAnswerQuestionResults(
  player: player, question: Questions, atQuestion: questionResults, isCorrect: boolean): void {
  const playerNameIndex = atQuestion.playersCorrectList.indexOf(player.playerName);
  atQuestion.playersCorrectList.splice(playerNameIndex, 1);
  if (isCorrect) {
    atQuestion.playersCorrectList.push(player.playerName);
  }
}
// ----------------------------------------------------------------------------//

export function playerQuestionResults(playerId: number, questionPosition: number): questionResults {
  const session = findQuizSessionViaPlayerId(playerId);
  // Error 400:
  if (!session) throw HTTPError(400, 'player ID does not exist!');
  const question = findAtQuestionMetadata(session, questionPosition);
  if (questionPosition <= 0 || !question) throw HTTPError(400, 'question position is not valid for this session!');
  if (session.state !== state.ANSWER_SHOW) throw HTTPError(400, 'session is not in ANSWER_SHOW state!');
  if (questionPosition > session.atQuestion) throw HTTPError(400, 'Error session is not yet up to this question!');
  // Success 200
  iterateQuestionResults(session, questionPosition);
  return session.questionResults[questionPosition - 1];
}

export function playerFinalResults(playerId: number): finalResults {
  const session = findQuizSessionViaPlayerId(playerId);
  // Error 400:
  if (!session) throw HTTPError(400, 'player ID does not exist!');
  if (session.state !== state.FINAL_RESULTS) throw HTTPError(400, 'session is not in FINAL_RESULTS state!');
  // success 200:
  const numQuestions: number = session.questionResults.length;
  for (let questionPosition = 1; questionPosition <= numQuestions; questionPosition++) {
    iterateQuestionResults(session, questionPosition);
  }
  const usersRankedByScore : user[] = [];
  for (const player of session.players) {
    usersRankedByScore.push({ ...{ name: player.playerName, score: player.totalScore } });
  }
  return {
    usersRankedByScore: usersRankedByScore.sort((a, b) => b.score - a.score),
    questionResults: session.questionResults
  };
}

export function playerReturnAllChat(playerId: number): playerReturnAllChatReturn {
  const session = findQuizSessionViaPlayerId(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');

  const messages = session.messages.sort((a, b) => a.timeSent - b.timeSent);
  return { messages };
}

export function playerSendChat(playerId: number, message: message): Record<string, never> {
  const session = findQuizSessionViaPlayerId(playerId);
  if (!session) throw HTTPError(400, 'Error player ID does not exist!');
  if (invalidMessageLength(message.messageBody)) throw HTTPError(400, 'If message body is less than 1 character or more than 100 characters');
  const player = session.players.find(p => p.playerId === playerId);
  const time = Math.floor(new Date().getTime() / 1000);
  const newChat:chat = {
    messageBody: message.messageBody,
    playerId: player.playerId,
    playerName: player.playerName,
    timeSent: time,
  };
  session.messages.push(newChat);
  return {};
}
