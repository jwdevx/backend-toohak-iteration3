import HTTPError from 'http-errors';
import {
  adminAuthRegister,
  adminQuestionCreate, // TODO do not use this cheng <--------------------------------
  adminQuestionCreateV2,
  adminQuizCreate,
  adminQuizRemove,
  clear,
  // adminQuizThumbnailUpdate,
  adminQuizViewSessions,
  adminQuizSessionStart,
  // adminQuizSessionStateUpdate,
  adminQuizSessionGetStatus,
// adminQuizSessionGetResults,
// adminQuizSessionGetResultsCSV,
} from './apiRequestsIter3';
import { QuestionBody, QuestionBodyV2, answer } from './dataStore'; // TODO do not use QuestionBody this cheng <--------------------------------
import {
  UserCreateReturn,
  QuizCreateReturn,
  QuestionCreateReturn,
  SessionQuizViewReturn,
  SessionCreateReturn,
  SessionStatusReturn,
} from './returnInterfaces';
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
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart('99999999', Quiz1, 3)).toThrow(HTTPError[401]);
  });
  test('token not provided', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart('', Quiz1, 3)).toThrow(HTTPError[401]);
  });
  test('quiz owner doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart(token2, Quiz1, 3)).toThrow(HTTPError[403]);
  });
  test('autostartNum greater than 50', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    expect(() => adminQuizSessionStart(token1, Quiz1, 51)).toThrow(HTTPError[400]);
  });
  test('quiz has no questions', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizSessionStart(token1, Quiz1, 4)).toThrow(HTTPError[400]);
  });
  test('quiz is in trash', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    adminQuizRemove(token1, Quiz1);
    expect(() => adminQuizSessionStart(token1, Quiz1, 4)).toThrow(HTTPError[400]);
  });
  test('more than 10 opening sessions', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
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
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(session).toStrictEqual(expect.any(Number));
  });
});

// =============================================================================
// ===================    adminQuizSessionStateUpdate   ========================
// =============================================================================

// TODO CHENG

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
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus('9999999', Quiz1, session)).toThrow(HTTPError[401]);
  });
  test('invalid sessionid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    adminQuizSessionStart(token1, Quiz1, 4);
    expect(() => adminQuizSessionGetStatus(token1, Quiz1, 99999)).toThrow(HTTPError[403]);
  });
  test('token not provided', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus('', Quiz1, session)).toThrow(HTTPError[401]);
  });
  test('the user doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus(token2, Quiz1, session)).toThrow(HTTPError[403]);
  });
  test('quizid doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreate(token1, 'second tests', 'second autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
    adminQuestionCreate(token1, Quiz2, body);
    const session = (adminQuizSessionStart(token1, Quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(() => adminQuizSessionGetStatus(token1, Quiz2, session)).toThrow(HTTPError[400]);
  });
  test('successful check', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(token1, 'tests', 'autotesting').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    // TODO adminQuestionCreateV2
    adminQuestionCreate(token1, Quiz1, body);
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
// ===================    adminQuizSessionGetResults   =========================
// =============================================================================

// TODO SADAT

// =============================================================================
// ===================    adminQuizSessionGetResultsCSV   ======================
// =============================================================================

// TODO SADAT
