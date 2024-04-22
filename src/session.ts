import HTTPError from 'http-errors';
import { findSession, findSessionId, getNow, matchQuizIdAndAuthor, randomIdGenertor, iterateQuestionResults } from './helper';
import { Action, DataStore, Quizzes, Session, Times, getData, getTimeList, metaData, playerAnswers, questionResults, setData, setTimeList, state } from './dataStore';
import { SessionQuizViewReturn, SessionCreateReturn, SessionStatusReturn, finalResults, user, CSVUrlReturn } from './returnInterfaces';
import fs from 'fs';
import { convertArrayToCSV } from 'convert-array-to-csv';
import config from './config.json';
import path from 'path';
interface eachAnswers {
  name: string;
  score: number;
  rank: number;
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
export function adminQuizViewSessions(token: string, quizId: number): SessionQuizViewReturn {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
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
  const data: DataStore = getData();
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = data.tokens.find(token => token.sessionId === sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId && quiz.owner === validToken.userId);
  if (isNaN(quizId) || !quiz) throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');

  // 3.Error 400
  if (autoStartNum > 50) throw HTTPError(400, 'Autostart cannot be higher than 50');
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
  setData(data);
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
    session.atQuestion = 0;
  }
}

export function goNext(session: Session) {
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
  if (!token || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(userSessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const session = findSession(sessionId);
  if (isNaN(quizId) || isNaN(sessionId) || !session) {
    throw HTTPError(400, 'Session does not exist.');
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
export function adminQuizSessionGetResults(token: string, quizId: number, sessionId: number): finalResults {
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
  const quiz = matchQuizIdAndAuthor(validToken.userId, quizId);
  if (isNaN(quizId) || !quiz || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  const session = findSession(sessionId);
  if (isNaN(sessionId) || !session || session.quizId !== quizId) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz.');
  }
  if (session.state !== state.FINAL_RESULTS) {
    throw HTTPError(400, 'Session is not in FINAL_RESULTS state');
  }
  // status 200
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

/**
 * Comments todo
 */
export function adminQuizSessionGetResultsCSV(token: string, quizId: number, sessionId: number): CSVUrlReturn {
  const data = getData();
  const Token = parseInt(token);
  const result = data.tokens.find(token => token.sessionId === Token);
  if (!result) {
    throw HTTPError(401, 'The session cannot be found');
  }
  const quizIndex = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (quizIndex.owner !== result.userId) {
    throw HTTPError(403, 'You do not have the authorization for the quiz');
  }
  const session = data.sessions.find(session => session.sessionId === sessionId && session.quizId === quizId);
  if (!session) {
    throw HTTPError(400, 'The session ID is invalid');
  }
  if (session.state !== state.FINAL_RESULTS) {
    throw HTTPError(400, 'The session state is not final results');
  }
  const header = ['Player'];
  const resultArray : string[][] = [];
  for (let i = 0; i < session.metadata.numQuestions; i++) {
    const num = i.toString();
    let question = 'question';
    let score = 'score';
    let rank = 'rank';
    question = question.concat(num);
    score = question.concat(score);
    rank = question.concat(rank);
    header.push(score);
    header.push(rank);
  }
  const players = session.numPlayers;
  for (const player of session.players) {
    const playerArr: string[] = [];
    playerArr.push(player.playerName);
    resultArray.push(playerArr);
  }
  resultArray.sort((a, b) => {
    // Convert both strings to lowercase to ensure case-insensitive comparison
    const stringA = a[0][0];
    const stringB = b[0][0];

    if (stringA < stringB) {
      return -1; // If the first string comes before the second one
    } else if (stringA > stringB) {
      return 1; // If the first string comes after the second one
    } else {
      return 0; // If the strings are equal
    }
  });
  const numAnswers = session.players[0].answers.length;
  for (let i = 0; i < numAnswers; i++) {
    const answerArray: eachAnswers[] = [];
    let rank = 1;
    for (let j = 0; j < players; j++) {
      const newAnswer : eachAnswers = {
        name: session.players[j].playerName,
        score: session.players[j].answers[i].score,
        rank: 0,
      };
      if (session.players[j].answers[i].answerTime === 0) {
        newAnswer.rank = -1;
      }
      answerArray.push(newAnswer);
    }
    answerArray.sort((a, b) => b.score - a.score);
    for (let j = 0; j < players; j++) {
      if (answerArray[j].rank === -1) {
        answerArray[j].rank = 0;
      } else {
        answerArray[j].rank = rank;
      }
      if (answerArray[j].score > 0) {
        rank++;
      }
    }
    for (let j = 0; j < players; j++) {
      const playerresult = resultArray.find(result => result[0] === answerArray[j].name);
      playerresult.push(answerArray[j].score.toString());
      playerresult.push(answerArray[j].rank.toString());
    }
  }
  resultArray.splice(0, 0, header);
  const fileName = 'result.csv';
  const directoryPath = path.join(__dirname, '../static');
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  fs.writeFile(path.join(directoryPath, fileName), convertArrayToCSV(resultArray), (err) => {
    if (err) {
      console.error('An error occurred:', err);
    }
  });
  const PORT: number = parseInt(process.env.PORT || config.port);
  const HOST: string = process.env.IP || 'localhost';
  let Url = 'http://';
  const port = PORT.toString();
  Url = Url.concat(HOST);
  Url = Url.concat(':');
  Url = Url.concat(port);
  Url = Url.concat('/static/result.csv');
  return {
    url: Url,
  };
}
