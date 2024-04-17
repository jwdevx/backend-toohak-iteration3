import HTTPError from 'http-errors';
import {
  adminAuthRegister,
  adminQuestionCreateV2,
  adminQuizCreate,
  adminQuizRemove,
  clear,
  // adminQuizThumbnailUpdate,
  adminQuizSessionStateUpdate,
  adminQuizSessionGetStatus,
  adminQuizViewSessions,
  adminQuizSessionStart,
  adminQuizCreateV2,
  playerJoin,
  playerQuestionAnswerSubmit,
  adminQuizInfoV2,
  adminQuizSessionGetResultsCSV
//   adminQuestionCreate,
//   adminQuizRemove,
} from './apiRequestsIter3';
import {
// adminQuizThumbnailUpdate,
//   adminQuizViewSessions,
//   adminQuizSessionStart,
// adminQuizSessionStateUpdate,
// adminQuizSessionGetStatus,
  adminQuizSessionGetResults,
// adminQuizSessionGetResultsCSV,
} from './apiRequestsIter3';
import { QuestionBodyV2, answer, state, Action } from './dataStore'; // TODO do not use QuestionBody this cheng <--------------------------------
import {
  UserCreateReturn,
  QuizCreateReturn,
  QuestionCreateReturn,
  SessionQuizViewReturn,
  SessionCreateReturn,
  SessionStatusReturn,
  quizInfoV2Return,
  finalResults,
  PlayerJoinReturn,
  CSVUrlReturn
} from './returnInterfaces';
import { delay } from './helper';
// import { QuestionBodyV2, answer } from './dataStore';

// const ERROR = { error: expect.any(String) };
beforeEach(() => {
  clear();
});

// =============================================================================
// ====================    adminQuizThumbnailUpdate   ==========================
// =============================================================================

// TODO ASH

// =============================================================================
// ======================    adminQuizViewSessions   ===========================
// =============================================================================

describe('View Sessions: /v1/admin/quiz/:quizid/sessions', () => {
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  beforeEach(() => {
    clear();
  });

  // 1.Error 401
  test('Check invalid token', () => {
    const sessionId1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(sessionId1, quizId1, questionBody1);
    adminQuizSessionStart(sessionId1, quizId1, 5);
    expect(() => adminQuizViewSessions(sessionId1 + 1, quizId1)).toThrow(HTTPError[401]);
    expect(() => adminQuizViewSessions('', quizId1)).toThrow(HTTPError[401]);
  });
  // 2.Error 403
  test('quiz owner doesnt matchV1', () => {
    const sessionId1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(sessionId1, quizId1, questionBody1);
    adminQuizSessionStart(sessionId1, quizId1, 5);
    expect(() => adminQuizViewSessions(sessionId1, quizId1 + 1)).toThrow(HTTPError[403]);
  });
  test('quiz owner doesnt matchV2', () => {
    const sessionId1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const sessionId2 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(sessionId1, quizId1, questionBody1);
    adminQuizSessionStart(sessionId1, quizId1, 5);
    expect(() => adminQuizViewSessions(sessionId2, quizId1)).toThrow(HTTPError[403]);
  });

  // 3.Success 200
  test('successful view sessions', () => {
    const sessionId1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(sessionId1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(sessionId1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(sessionId1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));

    // Create sessions
    const quizSessionId1 = (adminQuizSessionStart(sessionId1, quizId1, 4).bodyObj as SessionCreateReturn).sessionId;
    const quizSessionId2 = (adminQuizSessionStart(sessionId1, quizId1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    expect(quizSessionId2).toStrictEqual(expect.any(Number));

    // Sort It just for expected output in view sessions
    const unsortedActiveSessions = [quizSessionId1, quizSessionId2];
    const sortedActiveSessions = unsortedActiveSessions.sort((a, b) => a - b);

    // TODO MORE TEST  once END state action is implemented we can test more <----------------------------------------------------- cheng
    const viewQuizSession1 = adminQuizViewSessions(sessionId1, quizId1).bodyObj as SessionQuizViewReturn;
    expect(viewQuizSession1).toStrictEqual({
      activeSessions: sortedActiveSessions,
      inactiveSessions: [],
    });
  });
});

// =============================================================================
// ======================    adminQuizSessionStart   ===========================
// =============================================================================

describe('create session', () => {
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  beforeEach(() => {
    clear();
  });

  test('Check invalid token', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart('99999999', Quiz1, 3)).toThrow(HTTPError[401]);
  });
  test('token not provided', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart('', Quiz1, 3)).toThrow(HTTPError[401]);
  });
  test('quiz owner doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart(token2, Quiz1, 3)).toThrow(HTTPError[403]);
  });
  test('autostartNum greater than 50', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    expect(() => adminQuizSessionStart(token1, Quiz1, 51)).toThrow(HTTPError[400]);
  });
  test('quiz has no questions', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart(token1, Quiz1, 4)).toThrow(HTTPError[400]);
  });
  test('quiz is in trash', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuizRemove(token1, Quiz1);
    expect(() => adminQuizSessionStart(token1, Quiz1, 4)).toThrow(HTTPError[400]);
  });
  test('more than 10 opening sessions', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    adminQuizSessionStart(token1, Quiz1, 4);
    expect(() => adminQuizSessionStart(token1, Quiz1, 4)).toThrow(HTTPError[400]);
  });
  test('successful start', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(session).toStrictEqual(expect.any(Number));
  });
});

// =============================================================================
// ====================    adminQuizSessionGetStatus   =========================
// =============================================================================

describe('get status', () => {
  beforeEach(() => {
    clear();
  });
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  test('invalid userid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus('9999999', Quiz1, session)).toThrow(HTTPError[401]);
  });
  test('invalid sessionid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuizSessionStart(token1, Quiz1, 4);
    expect(() => adminQuizSessionGetStatus(token1, Quiz1, 99999)).toThrow(HTTPError[403]);
  });
  test('token not provided', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus('', Quiz1, session)).toThrow(HTTPError[401]);
  });
  test('the user doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuestionCreateV2(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus(token2, Quiz1, session)).toThrow(HTTPError[403]);
  });
  test('quizid doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreateV2(token1, 'second tests', 'second autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuestionCreateV2(token1, Quiz2, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus(token1, Quiz2, session)).toThrow(HTTPError[400]);
  });
  test('successful check', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://google.com/some/image/path.jpg'
    };
    adminQuestionCreateV2(token1, Quiz1, body);
    adminQuestionCreateV2(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    const status = adminQuizSessionGetStatus(token1, Quiz1, session).bodyObj as SessionStatusReturn;
    expect(status).toStrictEqual({
      state: expect.any(String),
      atQuestion: expect.any(Number),
      players: [],
      metadata: expect.any(Object)
    });
    expect(status.players.every(player => typeof player === 'string')).toBe(true);
  });
});

// =============================================================================
// ===================    adminQuizSessionStateUpdate   ========================
// =============================================================================

describe('update status', () => {
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  const answers = [answerObj1, answerObj2];
  const body : QuestionBodyV2 = {
    question: 'this is a test',
    duration: 3,
    points: 5,
    answers: answers,
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  let Quiz1: number;
  let token1: string;
  let sessionId: number;
  beforeEach(() => {
    clear();
    token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    // TODO adminQuestionCreateV2
    adminQuestionCreateV2(token1, Quiz1, body);
    sessionId = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
  });
  test('invalid token', () => {
    expect(() => adminQuizSessionStateUpdate('99999999', Quiz1, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[401]);
  });
  test('token is not provided', () => {
    expect(() => adminQuizSessionStateUpdate('', Quiz1, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[401]);
  });
  test('user and quiz doesnt match', () => {
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    expect(() => adminQuizSessionStateUpdate(token2, Quiz1, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[403]);
  });
  test('session invalid', () => {
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId + 100000, Action.NEXT_QUESTION)).toThrow(HTTPError[400]);
  });
  test('session and quiz doesnt match', () => {
    const Quiz2 = (adminQuizCreate(token1, 'second tests', 'second autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStateUpdate(token1, Quiz2, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[400]);
  });
  test('action is not valid', () => {
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, 'invalid action')).toThrow(HTTPError[400]);
  });
  test('process with skip', () => {
    let status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.LOBBY);
    let result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.NEXT_QUESTION);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_COUNTDOWN);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.SKIP_COUNTDOWN);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_OPEN);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.ANSWER_SHOW);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.FINAL_RESULTS);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.END);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.END);
  });
  test('process without skip', () => {
    let status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.LOBBY);
    let result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.NEXT_QUESTION);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_COUNTDOWN);
    delay(3000);
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_OPEN);
    delay(3000);
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_CLOSE);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.ANSWER_SHOW);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.FINAL_RESULTS);
    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.END);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.END);
  });
  test('all the invalid action', () => {
    let status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.LOBBY);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);

    let result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.NEXT_QUESTION);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_COUNTDOWN);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[400]);
    delay(3000);

    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_OPEN);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
    delay(3000);

    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.QUESTION_CLOSE);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);

    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.ANSWER_SHOW);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER)).toThrow(HTTPError[400]);

    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.FINAL_RESULTS);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_ANSWER)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.NEXT_QUESTION)).toThrow(HTTPError[400]);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);

    result = adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.END);
    expect(result.bodyObj).toStrictEqual({});
    status = adminQuizSessionGetStatus(token1, Quiz1, sessionId).bodyObj as SessionStatusReturn;
    expect(status.state).toStrictEqual(state.END);
    expect(() => adminQuizSessionStateUpdate(token1, Quiz1, sessionId, Action.END)).toThrow(HTTPError[400]);
  });
});

// =============================================================================
// ===================    adminQuizSessionGetResults   =========================
// =============================================================================

// TODO SADAT
describe('Session final result', () => {
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 10,
    points: 6,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody2: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 5,
    points: 2,
    answers: [
      { answer: 'Blue', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'Blue, white and green', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody3: QuestionBodyV2 = {
    question: 'What colour is the moon?',
    duration: 1,
    points: 5,
    answers: [
      { answer: 'white', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'black and white', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  beforeEach(() => {
    clear();
  });

  // 1.Error 401
  test('Check invalid token', () => {
    const token = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token, quizId1, questionBody1);
    const SessionId = (adminQuizSessionStart(token, quizId1, 5).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResults(token + 1, quizId1, SessionId)).toThrow(HTTPError[401]);
    expect(() => adminQuizSessionGetResults('', quizId1, SessionId)).toThrow(HTTPError[401]);
    expect(() => adminQuizSessionGetResults('hello', quizId1, SessionId)).toThrow(HTTPError[401]);
  });
  // 2.Error 403
  test('quiz owner doesnt matchV1', () => {
    const token = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token, quizId1, questionBody1);
    const sessionId = (adminQuizSessionStart(token, quizId1, 5).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResults(token, quizId1 + 1, sessionId)).toThrow(HTTPError[403]);
  });
  test('quiz owner doesnt matchV2', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quizId1, questionBody1);
    const sessionId = (adminQuizSessionStart(token1, quizId1, 5).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResults(token2, quizId1, sessionId)).toThrow(HTTPError[403]);
  });
  // error 400
  test('invalid session', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    // TODO adminQuestionCreateV2
    adminQuestionCreateV2(token1, Quiz1, questionBody1);
    const sessionId = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResults(token1, Quiz1, sessionId + 1000)).toThrow(HTTPError[400]);
  });
  test('session state not in FINAL_RESULTS', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    // TODO adminQuestionCreateV2
    adminQuestionCreateV2(token1, Quiz1, questionBody1);
    const sessionId = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResults(token1, Quiz1, sessionId)).toThrow(HTTPError[400]);
  });

  // 3.Success 200
  test('correct functionality', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    // making an array with all answers' id
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    // making an array with all correct answers' id
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // making an array with all wrong answers' id
    const wrongAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === false) { wrongAnswersQuestion1.push(a.answerId); }
    }
    // creating Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    const wrongAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === false) { wrongAnswersQuestion2.push(a.answerId); }
    }
    // creating Question 3
    const questionId3 = (adminQuestionCreateV2(token1, quizId1, questionBody3).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion3 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[2].answers;
    const allAnswersQuestion3: Array<number> = []; for (const a of answerObjectQuestion3) { allAnswersQuestion3.push(a.answerId); }
    const correctAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === true) { correctAnswersQuestion3.push(a.answerId); }
    }
    const wrongAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === false) { wrongAnswersQuestion3.push(a.answerId); }
    }
    // starting session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 4).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'julius').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'caesar').bodyObj as PlayerJoinReturn).playerId;
    const playerId3 = (playerJoin(quizSessionId1, 'alexander').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submits correct answers for question 1 twice and takes total 2 seconds
    // julius' score should for q1 should be 6 since he is first at getting it right. 6/1 = 6
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    // caesar is submitting wrong answers for question 1 and takes total 3 seconds
    // caesar's score for q1 is 0.
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 1, wrongAnswersQuestion1);
    // alexander is submitting correct answers for question 1 and takes total 4 seconds
    // alexanders's score for q1 should be 6/2 = 3 since he is second
    delay(1000);
    playerQuestionAnswerSubmit(playerId3, 1, correctAnswersQuestion1);
    // now let's end the question and process answer
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3 + 4) / 3 = 3.
    // expected percent correct = 2/3 * 100 which rounds to 67
    // let's move to second question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submitting wrong answers for question 2 and takes total 2 seconds
    // his score is 0.
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 2, wrongAnswersQuestion2);
    // caesar is submitting correct answers for question 2 and takes total 3 seconds
    // his score should be 2/1 = 2.
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 2, correctAnswersQuestion2);
    // alexander is submitting correct answers for question 2 but takes total 6 secs which exceeds the duration of 5 secs.
    // his answer should not be registered and should be marked as incorrect, scoring him 0.
    delay(3000);
    expect(() => playerQuestionAnswerSubmit(playerId3, 2, correctAnswersQuestion2)).toThrow(HTTPError[400]);
    // we should have moved to QUESTION_CLOSE automatically by now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3) / 2 = 2.5 which rounds to 3
    // expected percent correct = (1 / 3 * 100) which rounds to 33
    // let's move to third question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius, caesar and alexander couldnt submit within question duration of 1 sec
    // they all get zero
    delay(1000);
    expect(() => playerQuestionAnswerSubmit(playerId1, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId2, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId3, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    // goes to answer show with everyone getting 0
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // now let's see the final results
    // julius' total score: 6 + 0 + 0 = 6
    // caesar's total score: 0 + 2 + 0 = 2
    // alexander's total score: 3 + 0 + 0 = 3
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_FINAL_RESULTS');
    expect(adminQuizSessionGetResults(token1, quizId1, quizSessionId1).bodyObj as finalResults).toStrictEqual({
      usersRankedByScore: [{ name: 'julius', score: 6 }, { name: 'alexander', score: 3 }, { name: 'caesar', score: 2 }],
      questionResults: [{
        questionId: questionId1,
        playersCorrectList: ['alexander', 'julius'],
        averageAnswerTime: 3,
        percentCorrect: 67
      }, {
        questionId: questionId2,
        playersCorrectList: ['caesar'],
        averageAnswerTime: 3,
        percentCorrect: 33
      }, {
        questionId: questionId3,
        playersCorrectList: [],
        averageAnswerTime: 0,
        percentCorrect: 0
      }]
    });
  });
});
// =============================================================================
// ===================    adminQuizSessionGetResultsCSV   ======================
// =============================================================================

// TODO VENUS
describe('Session final result csv', () => {
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 10,
    points: 6,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody2: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 5,
    points: 2,
    answers: [
      { answer: 'Blue', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'Blue, white and green', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody3: QuestionBodyV2 = {
    question: 'What colour is the moon?',
    duration: 1,
    points: 5,
    answers: [
      { answer: 'white', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'black and white', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  beforeEach(() => {
    clear();
  });

  // 1.Error 401
  test('Check invalid token', () => {
    const token = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token, quizId1, questionBody1);
    const SessionId = (adminQuizSessionStart(token, quizId1, 5).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResultsCSV('', quizId1, SessionId)).toThrow(HTTPError[401]);
    expect(() => adminQuizSessionGetResultsCSV('hello', quizId1, SessionId)).toThrow(HTTPError[401]);
  });
  // 2.Error 403
  test('quiz owner doesnt matchV2', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quizId1, questionBody1);
    const sessionId = (adminQuizSessionStart(token1, quizId1, 5).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResultsCSV(token2, quizId1, sessionId)).toThrow(HTTPError[403]);
  });
  // error 400
  test('invalid session', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    // TODO adminQuestionCreateV2
    adminQuestionCreateV2(token1, Quiz1, questionBody1);
    const sessionId = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResultsCSV(token1, Quiz1, sessionId + 1000)).toThrow(HTTPError[400]);
  });
  test('session state not in FINAL_RESULTS', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    // TODO adminQuestionCreateV2
    adminQuestionCreateV2(token1, Quiz1, questionBody1);
    const sessionId = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetResultsCSV(token1, Quiz1, sessionId)).toThrow(HTTPError[400]);
  });

  // 3.Success 200
  test('correct functionality', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    // making an array with all answers' id
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    // making an array with all correct answers' id
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // making an array with all wrong answers' id
    const wrongAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === false) { wrongAnswersQuestion1.push(a.answerId); }
    }
    // creating Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    const wrongAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === false) { wrongAnswersQuestion2.push(a.answerId); }
    }
    // creating Question 3
    const questionId3 = (adminQuestionCreateV2(token1, quizId1, questionBody3).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion3 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[2].answers;
    const allAnswersQuestion3: Array<number> = []; for (const a of answerObjectQuestion3) { allAnswersQuestion3.push(a.answerId); }
    const correctAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === true) { correctAnswersQuestion3.push(a.answerId); }
    }
    const wrongAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === false) { wrongAnswersQuestion3.push(a.answerId); }
    }
    // starting session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 4).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'julius').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'caesar').bodyObj as PlayerJoinReturn).playerId;
    const playerId3 = (playerJoin(quizSessionId1, 'alexander').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submits correct answers for question 1 twice and takes total 2 seconds
    // julius' score should for q1 should be 6 since he is first at getting it right. 6/1 = 6
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    // caesar is submitting wrong answers for question 1 and takes total 3 seconds
    // caesar's score for q1 is 0.
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 1, wrongAnswersQuestion1);
    // alexander is submitting correct answers for question 1 and takes total 4 seconds
    // alexanders's score for q1 should be 6/2 = 3 since he is second
    delay(1000);
    playerQuestionAnswerSubmit(playerId3, 1, correctAnswersQuestion1);
    // now let's end the question and process answer
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3 + 4) / 3 = 3.
    // expected percent correct = 2/3 * 100 which rounds to 67
    // let's move to second question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submitting wrong answers for question 2 and takes total 2 seconds
    // his score is 0.
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 2, wrongAnswersQuestion2);
    // caesar is submitting correct answers for question 2 and takes total 3 seconds
    // his score should be 2/1 = 2.
    playerQuestionAnswerSubmit(playerId2, 2, correctAnswersQuestion2);
    // alexander is submitting correct answers for question 2 but takes total 6 secs which exceeds the duration of 5 secs.
    // his answer should not be registered and should be marked as incorrect, scoring him 0.
    playerQuestionAnswerSubmit(playerId3, 2, wrongAnswersQuestion2);
    // we should have moved to QUESTION_CLOSE automatically by now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3) / 2 = 2.5 which rounds to 3
    // expected percent correct = (1 / 3 * 100) which rounds to 33
    // let's move to third question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius, caesar and alexander couldnt submit within question duration of 1 sec
    // they all get zero
    delay(1000);
    expect(() => playerQuestionAnswerSubmit(playerId1, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId2, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId3, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    // goes to answer show with everyone getting 0
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // now let's see the final results
    // julius' total score: 6 + 0 + 0 = 6
    // caesar's total score: 0 + 2 + 0 = 2
    // alexander's total score: 3 + 0 + 0 = 3
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_FINAL_RESULTS');
    const CSV = (adminQuizSessionGetResultsCSV(token1, quizId1, quizSessionId1).bodyObj as CSVUrlReturn);
    expect(CSV.url.endsWith('.csv')).toBe(true);
  });
});