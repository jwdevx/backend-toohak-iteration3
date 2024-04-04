import HTTPError from 'http-errors';
import {
  checkToken,
  matchQuizIdAndAuthor,
  randomIdGenertor
} from './helper';
import { DataStore, Quizzes, Session, getData, state } from './dataStore';
export function adminQuizThumbnailUpdate(token: string, quizId: number, imgUrl:string): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function adminQuizViewSessions(token: string, quizId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function adminQuizSessionStart(token: string, quizId: number, autoStartNum: number) : {sessionId: number} {
  const validToken = checkToken(token);
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
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

export function adminQuizSessionStateUpdate(token: string, quizId: number, sessionId: number, action: string): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function adminQuizSessionGetStatus(token: string, quizId: number, sessionId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function adminQuizSessionGetResults(token: string, quizId: number, sessionId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}

export function adminQuizSessionGetResultsCSV(token: string, quizId: number, sessionId: number): Record<string, never> {
  // TODO update typescript return types
  return {};
}
