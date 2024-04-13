import HTTPError from 'http-errors';
import { findSession, findSessionId, getNow, matchQuizIdAndAuthor, randomIdGenertor } from './helper';
import { Action, DataStore, Quizzes, Session, Times, getData, getTimeList, metaData, playerAnswers, questionResults, setData, setTimeList, state } from './dataStore';
import { SessionQuizViewReturn, SessionCreateReturn, SessionStatusReturn } from './returnInterfaces';

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
export function adminQuizViewSessions(token: string, quizId: number): SessionQuizViewReturn {
  // 1.Error 401
  const userSessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(userSessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
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
export function adminQuizSessionStart(token: string, quizId: number, autoStartNum: number): SessionCreateReturn {
  // 1.Error 401
  const userSessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(userSessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz) throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');

  // 3.Error 400
  if (autoStartNum > 50) throw HTTPError(400, 'Autostart cannot be higher than 50');
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
  if (quiz.numQuestions === 0) throw HTTPError(400, 'The quiz does not have any questions.');
  if (quiz.intrash === true) throw HTTPError(400, 'The quiz is in trash.');

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
    thumbnailUrl: quiz.thumbnailUrl
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
  // ERROR 401
  const userSessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(userSessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // ERROR 403
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  const data : DataStore = getData();
  const session = data.sessions.find(session => session.sessionId === sessionId);
  if (!session) {
    throw HTTPError(400, 'The session doesnt exist.');
  }
  if (session.quizId !== quizId) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz.');
  }
  if (!(Object.keys(Action).includes(action))) {
    throw HTTPError(400, 'Action provided is not a valid Action enum');
  }
  switch (action) {
    case Action.SKIP_COUNTDOWN:
      skipCountdown(session);
      setData(data);
      break;
    case Action.END:
      endSession(session);
      setData(data);
      break;
    case Action.GO_TO_ANSWER:
      goAnswer(session);
      setData(data);
      break;
    case Action.GO_TO_FINAL_RESULTS:
      goFinal(session);
      setData(data);
      break;
    case Action.NEXT_QUESTION:
      goNext(session);
      setData(data);
      break;
  }
  return {};
}

function endSession(session: Session) {
  if (session.state === state.END) {
    throw HTTPError(400, 'The action is not allowed in the current state');
  } else if (
    session.state === state.FINAL_RESULTS ||
    session.state === state.LOBBY ||
    session.state === state.ANSWER_SHOW ||
    session.state === state.QUESTION_CLOSE
  ) {
    session.state = state.END;
  } else if (
    session.state === state.QUESTION_COUNTDOWN ||
    session.state === state.QUESTION_OPEN
  ) {
    const times: Times = getTimeList();
    const timeIndex = times.time.findIndex(timeout => timeout.sessionId === session.sessionId);
    clearTimeout(times.time[timeIndex].timeOut);
    times.time.splice(timeIndex, 1);
    setTimeList(times);
    session.atQuestion = 0;
    session.state = state.END;
  }
}
function skipCountdown(session: Session) {
  if (
    session.state === state.END ||
    session.state === state.FINAL_RESULTS ||
    session.state === state.LOBBY ||
    session.state === state.QUESTION_OPEN ||
    session.state === state.ANSWER_SHOW ||
    session.state === state.QUESTION_CLOSE
  ) {
    throw HTTPError(400, 'The action is not allowed in the current state');
  } else if (session.state === state.QUESTION_COUNTDOWN) {
    const times: Times = getTimeList();
    const timeIndex = times.time.findIndex(timeout => timeout.sessionId === session.sessionId);
    clearTimeout(times.time[timeIndex].timeOut);
    times.time.splice(timeIndex, 1);
    // initialization
    const createdTime = getNow();
    session.startTime = createdTime;
    const questionId = session.metadata.questions[session.atQuestion - 1].questionId;
    const defaultResult: questionResults = {
      questionId: questionId,
      playersCorrectList: [],
      averageAnswerTime: 0,
      percentCorrect: 0,
    };
    const defaultAnswer: playerAnswers = {
      correct: false,
      score: 0,
      answerIds: [],
      answerTime: 0,
    };
    session.questionResults.push({ ...defaultResult });
    for (const player of session.players) {
      player.answers.push({ ...defaultAnswer });
    }
    session.state = state.QUESTION_OPEN;
    const answerDuration: ReturnType<typeof setTimeout> = setTimeout(() => {
      const times: Times = getTimeList();
      session.state = state.QUESTION_CLOSE;
      const timeOutIndex = times.time.findIndex((timeOut) => timeOut.sessionId === session.sessionId);
      times.time.splice(timeOutIndex, 1);
      setTimeList(times);
    }, session.metadata.questions[session.atQuestion - 1].duration * 1000);
    times.time.push({
      sessionId: session.sessionId,
      timeOut: answerDuration,
    });
    setTimeList(times);
  }
}

function goAnswer(session: Session) {
  if (
    session.state === state.END ||
    session.state === state.FINAL_RESULTS ||
    session.state === state.LOBBY ||
    session.state === state.QUESTION_COUNTDOWN ||
    session.state === state.ANSWER_SHOW
  ) {
    throw HTTPError(400, 'The action is not allowed in the current state');
  } else if (session.state === state.QUESTION_OPEN) {
    const times: Times = getTimeList();
    const timeIndex = times.time.findIndex(timeout => timeout.sessionId === session.sessionId);
    clearTimeout(times.time[timeIndex].timeOut);
    times.time.splice(timeIndex, 1);
    setTimeList(times);
    session.state = state.ANSWER_SHOW;
  } else if (session.state === state.QUESTION_CLOSE) {
    session.state = state.ANSWER_SHOW;
  }
}

function goFinal(session: Session) {
  if (
    session.state === state.END ||
    session.state === state.FINAL_RESULTS ||
    session.state === state.LOBBY ||
    session.state === state.QUESTION_COUNTDOWN ||
    session.state === state.QUESTION_OPEN
  ) {
    throw HTTPError(400, 'The action is not allowed in the current state');
  } else if (
    session.state === state.ANSWER_SHOW ||
    session.state === state.QUESTION_CLOSE
  ) {
    session.state = state.FINAL_RESULTS;
  }
}

function goNext(session: Session) {
  if (
    session.state === state.END ||
    session.state === state.FINAL_RESULTS ||
    session.state === state.QUESTION_OPEN ||
    session.state === state.QUESTION_COUNTDOWN
  ) {
    throw HTTPError(400, 'The action is not allowed in the current state');
  } else if (
    session.state === state.ANSWER_SHOW ||
    session.state === state.LOBBY ||
    session.state === state.QUESTION_CLOSE
  ) {
    session.atQuestion++;
    const times: Times = getTimeList();
    session.state = state.QUESTION_COUNTDOWN;
    // count down time out
    const countDown: ReturnType<typeof setTimeout> = setTimeout(() => {
      const times: Times = getTimeList();
      const createdTime = getNow();
      session.startTime = createdTime;
      const questionId = session.metadata.questions[session.atQuestion - 1].questionId;
      const defaultResult : questionResults = {
        questionId: questionId,
        playersCorrectList: [],
        averageAnswerTime: 0,
        percentCorrect: 0,
      };
      const defaultAnswer : playerAnswers = {
        correct: false,
        score: 0,
        answerIds: [],
        answerTime: 0,
      };
      session.questionResults.push({ ...defaultResult });
      for (const player of session.players) {
        player.answers.push({ ...defaultAnswer });
      }
      session.state = state.QUESTION_OPEN;
      const answerDuration: ReturnType<typeof setTimeout> = setTimeout(() => {
        const times: Times = getTimeList();
        session.state = state.QUESTION_CLOSE;
        const timeOutIndex = times.time.findIndex((timeOut) => timeOut.sessionId === session.sessionId);
        times.time.splice(timeOutIndex, 1);
        setTimeList(times);
      }, session.metadata.questions[session.atQuestion - 1].duration * 1000);
      times.time.push({
        sessionId: session.sessionId,
        timeOut: answerDuration,
      });
      setTimeList(times);
    }, (3000));
    times.time.push({
      sessionId: session.sessionId,
      timeOut: countDown,
    });
    setTimeList(times);
  }
}

/**
 * Comments todo
 */
export function adminQuizSessionGetStatus(token: string, quizId: number, sessionId: number): SessionStatusReturn {
  // 1.Error 401
  const userSessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(userSessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const session = findSession(sessionId);
  if (isNaN(quizId) || isNaN(sessionId) || !session) {
    throw HTTPError(403, 'Session does not exist.');
  }
  if (session.owner !== validToken.userId) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  }

  // 3.Error 400
  if (session.quizId !== quizId) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz');
  }
  // 4.Success 200
  const metadata: metaData = {
    quizId: session.metadata.quizId,
    name: session.metadata.name,
    timeCreated: session.metadata.timeCreated,
    timeLastEdited: session.metadata.timeLastEdited,
    description: session.metadata.description,
    numQuestions: session.metadata.numQuestions,
    questions: session.metadata.questions,
    duration: session.metadata.duration,
    thumbnailURL: session.metadata.thumbnailUrl
  };
  const players: string[] = [];
  for (const player of session.players) {
    players.push(player.playerName);
  }
  return {
    state: session.state,
    atQuestion: session.atQuestion,
    players: players,
    metadata: metadata
  };
}

/**
 * Comments todo
 */
export function adminQuizSessionGetResults(token: string, quizId: number, sessionId: number): Record<string, never> {
  return {};
}

/**
 * Comments todo
 */
export function adminQuizSessionGetResultsCSV(token: string, quizId: number, sessionId: number): Record<string, never> {
  return {};
}
