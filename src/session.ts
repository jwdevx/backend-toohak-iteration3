import HTTPError from 'http-errors';
import { checkToken, matchQuizIdAndAuthor, randomIdGenertor } from './helper';
import { DataStore, Quizzes, Session, getData, state } from './dataStore';
interface sessionSummary {
  activeSessions: number[];
  inactiveSessions: number[];
}

export function adminQuizThumbnailUpdate(token: string, quizId: number, imgUrl:string): Record<string, never> {
  // TODO update typescript return types

  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}

/**
 * View active and inactive quiz sessions
 * Retrieves active and inactive session ids (sorted in ascending order) for a quiz
 *      Active sessions are sessions that are not in the END state.
 *      Inactive sessions are sessions in the END state.
 * @param {number} token - an encoded session ID of the user
 * @param {number} quizId - the authenticated quiz ID.
 * @returns {sessionSummary} - summary of the quiz view sessions
 *    An object containing active and inactive sessions or errorObject
 */
export function adminQuizViewSessions(token: string, quizId: number): sessionSummary {
  // 1.Error 401
  const validToken = checkToken(token);
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Success 200
  const data: DataStore = getData();
  const sessions = data.sessions.filter(session => session.metadata.quizId === quizId);
  const activeSessions = sessions.filter(session => session.state !== state.END)
    .map(session => session.sessionId)
    .sort((a, b) => a - b);
  const inactiveSessions = sessions.filter(session => session.state === state.END)
    .map(session => session.sessionId)
    .sort((a, b) => a - b);
  return { activeSessions, inactiveSessions };
}

/**
 * Comments todo
 */
export function adminQuizSessionStart(
  token: string,
  quizId: number,
  autoStartNum: number): { sessionId: number } {
  // 1.Error 401
  const validToken = checkToken(token);

  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  if (autoStartNum > 50) {
    throw HTTPError(400, 'Autostart cannot be higher than 50');
  }
  const data: DataStore = getData();
  let count = 0;
  for (const session of data.sessions) {
    if (session.metadata.quizId === quizId && session.state !== state.END) {
      count++;
    }
  }
  if (count >= 10) {
    throw HTTPError(400, 'There are more than 10 session runing at the moment');
  }
  if (quiz.numQuestions === 0) {
    throw HTTPError(400, 'The quiz does not have any questions.');
  }
  if (quiz.intrash === true) {
    throw HTTPError(400, 'The quiz is in trash.');
  }
  // 4.Success 200
  const quizSessionId = randomIdGenertor();
  const quizCopy : Quizzes = {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    owner: quiz.owner,
    numQuestions: quiz.numQuestions,
    questions: quiz.questions,
    intrash: quiz.intrash,
    duration: quiz.duration,
    thumbnailURL: quiz.thumbnailURL
  };
  const newsession : Session = {
    quizId: quiz.quizId,
    sessionId: quizSessionId,
    owner: quiz.owner,
    autoStartNum: autoStartNum,
    startTime: 0,
    state: state.LOBBY,
    atQuestion: 0,
    players: [],
    numPlayers: 0,
    metadata: quizCopy,
    questionResults: [],
    messages: [],
  };
  data.sessions.push(newsession);
  return { sessionId: quizSessionId };
}

/**
 * Comments todo
 */
export function adminQuizSessionStateUpdate(token: string, quizId: number, sessionId: number, action: string): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}

/**
 * Comments todo
 */
export function adminQuizSessionGetStatus(token: string, quizId: number, sessionId: number): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}

/**
 * Comments todo
 */
export function adminQuizSessionGetResults(token: string, quizId: number, sessionId: number): Record<string, never> {
  // TODO, find a small dog and update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}

/**
 * Comments todo
 */
export function adminQuizSessionGetResultsCSV(token: string, quizId: number, sessionId: number): Record<string, never> {
  // TODO update typescript return types
  // 1.Error 401

  // 2.Error 403

  // 3.Error 400

  // 4.Success 200

  return {};
}
