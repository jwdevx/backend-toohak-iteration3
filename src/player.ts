import HTTPError from 'http-errors';
import { message, player, state } from './dataStore';
import { PlayerJoinReturn, playerQuestionPositionInfoReturn } from './returnInterfaces';
import { findQuizSessionViaPlayerId, findAtQuestionMetadata, randomIdGenertor, findSession } from './helper';

/**
 * To DO.....! ? ? ? ?
 */
export function playerJoin(sessionId: number, name: string): PlayerJoinReturn {
  const quizSession = findSession(sessionId);
  const newPlayer: player = {
    playerId: randomIdGenertor(),
    playerName: name,
    totalScore: 0,
    answers: [],
  };
  quizSession.players.push(newPlayer);
  return { playerId: newPlayer.playerId };
}

export function playerStatus(playerId: number): Record<string, never> { return {}; }

/**
 * Get the information about a question that the guest player is on. Question position starts at 1
 * @param {number} playerId - an encoded session ID of the user
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

export function playerQuestionAnswerSubmit(playerId: number, questionPosition: number, answerIds: number[]): Record<string, never> {
  return {};
}

export function playerQuestionResults(playerId: number, questionPosition: number): Record<string, never> {
  return {};
}

export function playerFinalResults(playerId: number): Record<string, never> {
  return {};
}

export function playerReturnAllChat(playerId: number): Record<string, never> {
  return {};
}

export function playerSendChat(playerId: number, message: message): Record<string, never> {
  return {};
}
