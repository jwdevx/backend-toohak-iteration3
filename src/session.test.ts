test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});
import HTTPError from 'http-errors';
import {
  adminAuthRegister,
  adminQuestionCreate,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizSessionGetStatus,
  adminQuizSessionStart,
  clear,
//   adminQuizCreate,
//   adminAuthRegister,
//   adminQuestionCreate,
//   adminQuizRemove,
} from './apiRequestsIter3';
import {
// adminQuizThumbnailUpdate,
//   adminQuizViewSessions,
//   adminQuizSessionStart,
// adminQuizSessionStateUpdate,
// adminQuizSessionGetStatus,
// adminQuizSessionGetResults,
// adminQuizSessionGetResultsCSV,
} from './apiRequestsIter3';
import { QuestionBody, answer } from './dataStore';
import { QuizCreateReturn, SessionCreateReturn, SessionStatusReturn, UserCreateReturn } from './returnInterfaces';

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

// TODO JASON
/*
describe('View Sessions: /v1/admin/quiz/:quizid/sessions', () => {
  // TODO uncomment thumbnailUrl once sadat implemented it
  const questionBody1 = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [{ answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    // thumbnailUrl: "http://google.com/some/image/path.jpg"
  };
  beforeEach(() => {
    clear();
  });

  // 1.Error 401
  test('Check invalid token', () => {
    const sessionId1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const quizId1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj.quizId;
    adminQuestionCreate(sessionId1, quizId1, questionBody1); // TODO change to V2 once implemented
    adminQuizSessionStart(sessionId1, quizId1, 5);

    let viewQuizSession1 = adminQuizViewSessions(sessionId1 + 1, quizId1);
    expect(viewQuizSession1.statusCode).toStrictEqual(401);
    expect(viewQuizSession1.bodyObj).toStrictEqual(ERROR);

    // Token is empty
    viewQuizSession1 = adminQuizViewSessions('', quizId1);
    expect(viewQuizSession1.statusCode).toStrictEqual(401);
    expect(viewQuizSession1.bodyObj).toStrictEqual(ERROR);
  });
  // 2.Error 403
  test('quiz owner doesnt matchV1', () => {
    const sessionId1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const quizId1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj.quizId;
    adminQuestionCreate(sessionId1, quizId1, questionBody1); // TODO change to V2 once implemented
    adminQuizSessionStart(sessionId1, quizId1, 5);

    const viewQuizSession1 = adminQuizViewSessions(sessionId1, quizId1 + 1);
    expect(viewQuizSession1.statusCode).toStrictEqual(403);
    expect(viewQuizSession1.bodyObj).toStrictEqual(ERROR);
  });
  test('quiz owner doesnt matchV2', () => {
    const sessionId1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId2 = adminAuthRegister('sadatadat@gmail.com', 'WadadOjiaoZC123', 'Sadsfat', 'Kabsdair').bodyObj.token;
    const quizId1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj.quizId;
    adminQuestionCreate(sessionId1, quizId1, questionBody1); // TODO change to V2 once implemented

    adminQuizSessionStart(sessionId1, quizId1, 5);
    const viewQuizSession1 = adminQuizViewSessions(sessionId2, quizId1); // differerent owner
    expect(viewQuizSession1.statusCode).toStrictEqual(403);
    expect(viewQuizSession1.bodyObj).toStrictEqual(ERROR);
  });

  // 3.Success 200
  test('successful view sessions', () => {
    // Create User 1
    const user1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd1', 'Haydena', 'Smitha');
    expect(user1.statusCode).toStrictEqual(200);
    const sessionId1 = user1.bodyObj.token;

    // Create 2 Quiz only by User1
    const quiz1 = adminQuizCreate(sessionId1, 'quiz1name', 'quiz1description');
    expect(quiz1.statusCode).toStrictEqual(200);
    const quizId1 = quiz1.bodyObj.quizId;

    // TODO change to adminQuestionCreateV2 once sadat implemented it
    const questionCreate1 = adminQuestionCreate(sessionId1, quizId1, questionBody1);
    expect(questionCreate1.statusCode).toStrictEqual(200);

    // Create sessions
    const quizSession1 = adminQuizSessionStart(sessionId1, quizId1, 4);
    const quizSession2 = adminQuizSessionStart(sessionId1, quizId1, 4);
    expect(quizSession1.statusCode).toStrictEqual(200);
    expect(quizSession2.statusCode).toStrictEqual(200);
    const quizSessionId1 = quizSession1.bodyObj.sessionId;
    const quizSessionId2 = quizSession2.bodyObj.sessionId;

    // Sort It just for expected output in view sessions
    const unsortedActiveSessions = [quizSessionId1, quizSessionId2];
    const sortedActiveSessions = unsortedActiveSessions.sort((a, b) => a - b);

    // TODO once END state action is implemented we can test more
    const viewQuizSession1 = adminQuizViewSessions(sessionId1, quizId1);
    expect(viewQuizSession1.statusCode).toStrictEqual(200);
    expect(viewQuizSession1.bodyObj).toStrictEqual({
      activeSessions: sortedActiveSessions,
      inactiveSessions: [],
    });
  });
});
*/

// =============================================================================
// ======================    adminQuizSessionStart   ===========================
// =============================================================================

// TODO CHENG

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
    expect(status).toEqual({
      state: expect.any(String),
      atQuestion: expect.any(Number),
      players: [],
      metadata: expect.any(Object)
    });
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
