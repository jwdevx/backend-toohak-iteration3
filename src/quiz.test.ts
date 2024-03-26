import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
} from './apiRequests';

import {
  adminQuizRemove,
  adminQuizTrashView,
  adminQuizTrashRestore,
  adminQuizTrashEmpty,
} from './apiRequests';

const ERROR = { error: expect.any(String) };
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

beforeEach(() => {
  clear();
});

// =============================================================================
// =========================    adminQuizCreate   ==============================
// =============================================================================

describe('Testing create quizzes return quiz id', () => {
  beforeEach(() => {
    clear();
  });
  test('Check successfully quiz addition', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    const quiz = adminQuizCreate(res.bodyObj.token, 'yourname', 'yourdescription');
    expect(quiz.statusCode).toStrictEqual(200);
    expect(quiz.bodyObj).toStrictEqual({ quizId: expect.any(Number) });
  });
  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    const Quiz1 = adminQuizCreate(wrongtoken, 'tests', 'autotesting');
    expect(Quiz1.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(Quiz1.statusCode).toStrictEqual(401);
  });
  test('check invalid characters', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz@/500', 'i love autotests');
    const Quiz1Body = Quiz1.bodyObj;
    const Quiz1Status = Quiz1.statusCode;
    expect(Quiz1Body).toStrictEqual(ERROR);
    expect(Quiz1Status).toStrictEqual(BAD_REQUEST);
  });
  test('check invalid name length', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'qq', 'quizzes are so fun');
    const Quiz1Body = Quiz1.bodyObj;
    const Quiz1Status = Quiz1.statusCode;
    expect(Quiz1Body).toStrictEqual({ error: expect.any(String) });
    expect(Quiz1Status).toStrictEqual(BAD_REQUEST);
  });
  test('check used quiz names', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    adminQuizCreate(user1, 'quiz1', 'first quiz');
    adminQuizCreate(user1, 'quiz2', 'Second quiz');
    const Quiz = adminQuizCreate(user1, 'quiz2', 'hahaha redundant naming');
    const QuizBody = Quiz.bodyObj;
    const QuizStatus = Quiz.statusCode;
    expect(QuizBody).toStrictEqual({ error: 'The name has already used for the quiz you created before' });
    expect(QuizStatus).toStrictEqual(BAD_REQUEST);
  });
  test('check invalid description length', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const longdescription = 'a'.repeat(150);
    const Quiz = adminQuizCreate(user1, 'quiz1', longdescription);
    const QuizBody = Quiz.bodyObj;
    const QuizStatus = Quiz.statusCode;
    expect(QuizBody).toStrictEqual({ error: expect.any(String) });
    expect(QuizStatus).toStrictEqual(BAD_REQUEST);
  });
});

// =============================================================================
// =========================    adminQuizList   ================================
// =============================================================================

describe('Testing print quiz list return quizzes', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    adminQuizCreate(token1.bodyObj.token, 'quiz1', 'first quiz');
    adminQuizCreate(token1.bodyObj.token, 'quiz2', 'Second quiz');
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    const List = adminQuizList(wrongtoken);
    expect(List.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(List.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('correct input without trash', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz').bodyObj.quizId;
    const List = adminQuizList(sessionId);
    expect(List.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1',
        },
        {
          quizId: quiz2,
          name: 'quiz2',
        }
      ]
    });
  });
  test('user does not have any quizzes', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const List = adminQuizList(sessionId);
    expect(List.bodyObj).toStrictEqual({
      quizzes: []
    });
  });
});

// =============================================================================
// =========================     adminQuizInfo    ==============================
// =============================================================================

// TODO after quizupdate check error iteration1, timeCreated !== timelastEdited

describe('Testing get quiz info', () => {
  beforeEach(() => {
    clear();
  });
  test('Checks correct info and format ', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId1 = token1.bodyObj.token;

    const quiz1 = adminQuizCreate(sessionId1, 'quiz1name', 'quiz1description');
    expect(quiz1.statusCode).toStrictEqual(200);
    const id = quiz1.bodyObj.quizId;

    const quizinfo = adminQuizInfo(sessionId1, quiz1.bodyObj.quizId);
    expect(quizinfo.statusCode).toStrictEqual(200);
    expect(quizinfo.bodyObj).toStrictEqual({
      quizId: id,
      name: 'quiz1name',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1description',
      numQuestions: 0,
      questions: [],
      duration: 0
    });
  });
  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(token1.bodyObj.token, 'quiz1', 'first quiz');
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    const info = adminQuizInfo(wrongtoken, quiz1.bodyObj.quizId);
    expect(info.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(info.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('quizId doesnt refer to valid quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const quizId = adminQuizCreate(token1.bodyObj.token, 'quiz1', 'first quiz').bodyObj.quizId;
    const info = adminQuizInfo(token1.bodyObj.token, quizId + 1);
    expect(info.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(info.statusCode).toStrictEqual(403);
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
    const name1 = 'test1';
    const description1 = 'test1';
    const quizobj1 = adminQuizCreate(token1.bodyObj.token, name1, description1);
    const name2 = 'test2';
    const description2 = 'test2';
    const quizobj2 = adminQuizCreate(token2.bodyObj.token, name2, description2);
    const quizId2 = quizobj2.bodyObj.quizId;
    const quizId1 = quizobj1.bodyObj.quizId;
    expect(adminQuizInfo(token2.bodyObj.token, quizId1).bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(adminQuizInfo(token1.bodyObj.token, quizId2).bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(adminQuizInfo(token1.bodyObj.token, quizId2).statusCode).toStrictEqual(FORBIDDEN);
  });
  test('testing time format', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const quizId = adminQuizCreate(token1.bodyObj.token, 'quiz1', 'first quiz').bodyObj.quizId;
    const quizInfo = adminQuizInfo(token1.bodyObj.token, quizId).bodyObj;
    expect(quizInfo.timeCreated.toString()).toMatch(/^\d{10}$/);
    expect(quizInfo.timeLastEdited.toString()).toMatch(/^\d{10}$/);
  });
});

// =============================================================================
// =======================    adminQuizNameUpdate   ============================
// =============================================================================

describe('Testing QuizNameUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for invalid Token
  test('Check invalid token', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const token = (parseInt(decodeURIComponent(user1)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    const NameUpdate = adminQuizNameUpdate(Quiz1, wrongtoken, 'quiz02');
    expect(NameUpdate.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(NameUpdate.statusCode).toStrictEqual(UNAUTHORIZED);
  });

  // Tesing for empty token
  test('Check empty token', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const emptyToken = '';
    const NameUpdate = adminQuizNameUpdate(Quiz1, emptyToken, 'quiz02');
    expect(NameUpdate.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });
    expect(NameUpdate.statusCode).toStrictEqual(UNAUTHORIZED);
  });

  // Testing for quizId validity
  test('Check invalid Quiz ID', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1 + 1, user1, 'quiz02');
    expect(NameUpdate.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(NameUpdate.statusCode).toStrictEqual(FORBIDDEN);
  });

  // Testing for quiz owner
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj.token;
    const user2 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const Quiz2 = adminQuizCreate(user2, 'quiz02', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1, user2, 'quiz3');
    const NameUpdate2 = adminQuizNameUpdate(Quiz2, user1, 'quiz4');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    const NameUpdate2Body = NameUpdate2.bodyObj;
    const NameUpdate2Status = NameUpdate2.statusCode;
    expect(NameUpdateBody).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(NameUpdate2Body).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(NameUpdateStatus).toStrictEqual(FORBIDDEN);
    expect(NameUpdate2Status).toStrictEqual(FORBIDDEN);
  });

  // Testing for input character validity
  test('check invalid characters', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1, user1, 'BdDhk!@#?/iter1<');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    expect(NameUpdateBody).toStrictEqual(ERROR);
    expect(NameUpdateStatus).toStrictEqual(BAD_REQUEST);
  });

  // Testing for input character length
  test('check invalid name length', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1, user1, 'hi');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    expect(NameUpdateBody).toStrictEqual(ERROR);
    expect(NameUpdateStatus).toStrictEqual(BAD_REQUEST);
  });

  /// /Testing for input character length
  test('check invalid name length', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1, user1, 'hhhheeeeeeeeeeelllllllllllllllloooooooooooooooooo');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    expect(NameUpdateBody).toStrictEqual(ERROR);
    expect(NameUpdateStatus).toStrictEqual(BAD_REQUEST);
  });

  // Testing for invalid name input
  test('name is empty', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1, user1, '');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    expect(NameUpdateBody).toStrictEqual(ERROR);
    expect(NameUpdateStatus).toStrictEqual(BAD_REQUEST);
  });

  // Testing for quiz name duplicate
  test('check used quiz names', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    adminQuizCreate(user1, 'quiz1', 'first quiz');
    const quiz = adminQuizCreate(user1, 'quiz2', 'Second quiz').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(quiz, user1, 'quiz1');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    expect(NameUpdateBody).toStrictEqual({ error: 'The name has already used for the quiz you created before' });
    expect(NameUpdateStatus).toStrictEqual(BAD_REQUEST);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const quiz = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const NameUpdate = adminQuizNameUpdate(quiz, user1, 'quiz20');
    const NameUpdateBody = NameUpdate.bodyObj;
    const NameUpdateStatus = NameUpdate.statusCode;
    expect(NameUpdateBody).toStrictEqual({ });
    expect(NameUpdateStatus).toStrictEqual(OK);
  });
});

// =============================================================================
// ======================    adminQuizDescriptionUpdate   ======================
// =============================================================================

describe('Testing QuizDescriptionUpdate', () => {
  beforeEach(() => {
    clear();
  });

  test('Check invalid token', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const token = (parseInt(decodeURIComponent(user1)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    const DescriptionUpdate = adminQuizDescriptionUpdate(Quiz1, wrongtoken, 'i hate autotests');
    expect(DescriptionUpdate.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(DescriptionUpdate.statusCode).toStrictEqual(UNAUTHORIZED);
  });

  test('Check invalid token', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const emptyToken = '';
    const DescriptionUpdate = adminQuizDescriptionUpdate(Quiz1, emptyToken, 'i hate autotests');
    expect(DescriptionUpdate.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });
    expect(DescriptionUpdate.statusCode).toStrictEqual(UNAUTHORIZED);
  });

  test('Check invalid Quiz ID', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const DescriptionUpdate = adminQuizDescriptionUpdate(Quiz1 + 1, user1, 'quiz02');
    expect(DescriptionUpdate.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(DescriptionUpdate.statusCode).toStrictEqual(FORBIDDEN);
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj.token;
    const user2 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const Quiz2 = adminQuizCreate(user2, 'quiz02', 'i love autotests').bodyObj.quizId;
    const DescriptionUpdate = adminQuizDescriptionUpdate(Quiz1, user2, 'quiz3');
    const DescriptionUpdate2 = adminQuizDescriptionUpdate(Quiz2, user1, 'quiz3');
    const DescriptionUpdateBody = DescriptionUpdate.bodyObj;
    const DescriptionUpdateStatus = DescriptionUpdate.statusCode;
    const DescriptionUpdate2Body = DescriptionUpdate2.bodyObj;
    const DescriptionUpdate2Status = DescriptionUpdate2.statusCode;
    expect(DescriptionUpdateBody).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(DescriptionUpdate2Body).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(DescriptionUpdateStatus).toStrictEqual(FORBIDDEN);
    expect(DescriptionUpdate2Status).toStrictEqual(FORBIDDEN);
  });

  // Testing for too long description
  test('long description', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const longdescription = 'a'.repeat(150);
    const DescriptionUpdate = adminQuizDescriptionUpdate(quiz1, user1, longdescription);
    expect(DescriptionUpdate.bodyObj).toStrictEqual({ error: expect.any(String) });
    expect(DescriptionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj.quizId;
    const DescriptionUpdate = adminQuizDescriptionUpdate(Quiz1, user1, 'quiz2');
    const DescriptionUpdateBody = DescriptionUpdate.bodyObj;
    const DescriptionUpdateStatus = DescriptionUpdate.statusCode;
    expect(DescriptionUpdateBody).toStrictEqual({ });
    expect(DescriptionUpdateStatus).toStrictEqual(OK);
  });
});

// =============================================================================
// ===========================    QUIZ TRASH    ================================
// =============================================================================
// =========================    adminQuizRemove   ==============================
// =============================================================================

describe('Testing if adminQuizRemove successfully removes the given quiz', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const sessionId1 = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    const remove = adminQuizRemove(wrongtoken, quiz1.bodyObj.quizId);
    expect(remove.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(remove.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('invalid quiz id', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const remove = adminQuizRemove(sessionId, quiz1.bodyObj.quizId + 9999);
    expect(remove.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(remove.statusCode).toStrictEqual(403);
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong');
    const sessionId1 = token1.bodyObj.token;
    const sessionId2 = token2.bodyObj.token;

    const quiz1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId2, 'quiz2', 'Second quiz');

    const remove = adminQuizRemove(sessionId2, quiz1.bodyObj.quizId);
    expect(remove.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(remove.statusCode).toStrictEqual(403);
  });
  test('Successfully removed a quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const list = adminQuizList(sessionId);
    expect(list.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz2.bodyObj.quizId,
          name: 'quiz2',
        }
      ]
    });
  });
  test('Successfully removed multiple quizzes', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const quiz3 = adminQuizCreate(sessionId, 'quiz3', 'third quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    adminQuizRemove(sessionId, quiz2.bodyObj.quizId);
    const list = adminQuizList(sessionId);
    expect(list.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz3.bodyObj.quizId,
          name: 'quiz3',
        }
      ]
    });
  });
  test('testing the return type of adminQuizRemove', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const remove = adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    expect(remove.bodyObj).toStrictEqual({});
  });
});

// =============================================================================
// =======================    adminQuizTrashView    ============================
// =============================================================================

describe('Testing if adminQuizTrashView successfully views quiz in trash', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash = adminQuizTrashView('999999999');
    expect(trash.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(trash.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('correct input', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash = adminQuizTrashView(sessionId);
    expect(trash.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    expect(trash.statusCode).toStrictEqual(OK);
  });
});

// =============================================================================
// =======================    adminQuizTrashRestore    =========================
// =============================================================================

describe('Testing for adminQuizTrashRestore successfully restore quiz in trash', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash1 = adminQuizTrashView(sessionId);
    expect(trash1.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestore('9999999', quiz1.bodyObj.quizId);
    expect(restore.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(restore.statusCode).toStrictEqual(UNAUTHORIZED);
    const trash2 = adminQuizTrashView(sessionId);
    expect(trash2.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
  });
  test('quizid invalid', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash1 = adminQuizTrashView(sessionId);
    expect(trash1.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestore(sessionId, quiz1.bodyObj.quizId + 999999);
    expect(restore.bodyObj).toStrictEqual({ error: 'The quiz does not exist.' });
    expect(restore.statusCode).toStrictEqual(FORBIDDEN);
    const trash2 = adminQuizTrashView(sessionId);
    expect(trash2.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
  });
  test('user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId1 = token1.bodyObj.token;
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'tony', 'kkkk');
    const sessionId2 = token2.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId2, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId1, quiz1.bodyObj.quizId);
    const trash1 = adminQuizTrashView(sessionId1);
    expect(trash1.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestore(sessionId2, quiz1.bodyObj.quizId);
    expect(restore.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(restore.statusCode).toStrictEqual(FORBIDDEN);
    const trash2 = adminQuizTrashView(sessionId1);
    expect(trash2.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
  });
  test('quiz is not in trash', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash1 = adminQuizTrashView(sessionId);
    expect(trash1.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestore(sessionId, quiz2.bodyObj.quizId);
    expect(restore.bodyObj).toStrictEqual({ error: 'The quiz is not in trash.' });
    expect(restore.statusCode).toStrictEqual(BAD_REQUEST);
    const trash2 = adminQuizTrashView(sessionId);
    expect(trash2.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
  });
  test('quiz name is used', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash1 = adminQuizTrashView(sessionId);
    expect(trash1.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    adminQuizCreate(sessionId, 'quiz1', 'third quiz');
    const restore = adminQuizTrashRestore(sessionId, quiz1.bodyObj.quizId);
    expect(restore.bodyObj).toStrictEqual({ error: 'The quiz name is used by another quiz' });
    expect(restore.statusCode).toStrictEqual(BAD_REQUEST);
    const trash2 = adminQuizTrashView(sessionId);
    expect(trash2.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
  });
  test('correct inputs', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = token1.bodyObj.token;
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const trash1 = adminQuizTrashView(sessionId);
    expect(trash1.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.bodyObj.quizId,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestore(sessionId, quiz1.bodyObj.quizId);
    expect(restore.bodyObj).toStrictEqual({});
    expect(restore.statusCode).toStrictEqual(OK);
    const trash2 = adminQuizTrashView(sessionId);
    expect(trash2.bodyObj).toStrictEqual({ quizzes: [] });
  });
});

// =============================================================================
// =======================    adminQuizTrashEmpty    ===========================
// =============================================================================

describe('Testing if able to remove trash permanently using adminQuizTrashEmpty', () => {
  beforeEach(() => {
    clear();
  });
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const user1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd1', 'Haydena', 'Smitha');
    expect(user1.statusCode).toStrictEqual(200);
    const user2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd2', 'Haydenb', 'Smithb');
    expect(user2.statusCode).toStrictEqual(200);
    const sessionId1 = user1.bodyObj.token;
    const sessionId2 = user2.bodyObj.token;

    // Create Quiz only by User1
    const quiz1 = adminQuizCreate(sessionId1, 'quiz1name', 'quiz1description');
    expect(quiz1.statusCode).toStrictEqual(200);
    const quiz2 = adminQuizCreate(sessionId1, 'quiz2name', 'quiz2description');
    expect(quiz2.statusCode).toStrictEqual(200);

    // Put Quiz 1 in trash
    const quiz1Remove = adminQuizRemove(sessionId1, quiz1.bodyObj.quizId);
    expect(quiz1Remove.statusCode).toBe(200);

    // Error 401 'Token is empty or not provided'
    const emptyRes1 = adminQuizTrashEmpty('', JSON.stringify([quiz1.bodyObj.quizId]));
    expect(emptyRes1.statusCode).toBe(401);
    expect(emptyRes1.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });

    // Error 401
    const error = adminQuizTrashEmpty('9999999999', JSON.stringify([quiz1.bodyObj.quizId]));
    expect(error.statusCode).toBe(401);
    expect(error.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });

    // Error 400 'quizIds must be numbers'
    const error1 = adminQuizTrashEmpty(sessionId1, JSON.stringify(['999999999']));
    expect(error1.statusCode).toBe(400);
    expect(error1.bodyObj).toStrictEqual({ error: 'quizIds must be numbers' });

    // Error 400  'One or more of the Quiz IDs is not currently in the trash'
    const emptyRes2 = adminQuizTrashEmpty(sessionId1, JSON.stringify([quiz1.bodyObj.quizId, quiz2.bodyObj.quizId]));
    expect(emptyRes2.statusCode).toBe(400);
    expect(emptyRes2.bodyObj).toStrictEqual({ error: 'One or more of the Quiz IDs is not currently in the trash' });

    // Error 403 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner'
    const emptyRes3 = adminQuizTrashEmpty(sessionId2, JSON.stringify([quiz1.bodyObj.quizId]));
    expect(emptyRes3.statusCode).toBe(403);
    expect(emptyRes3.bodyObj).toStrictEqual({ error: 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner' });

    // 200 - success permanently delete
    const emptyRes4 = adminQuizTrashEmpty(sessionId1, JSON.stringify([quiz1.bodyObj.quizId]));
    expect(emptyRes4.statusCode).toBe(200);
    expect(emptyRes4.bodyObj).toStrictEqual({});

    const restore = adminQuizTrashRestore(sessionId1, quiz1.bodyObj.quizId);
    expect(restore.bodyObj).toStrictEqual({ error: 'The quiz does not exist.' });
    expect(restore.statusCode).toStrictEqual(FORBIDDEN);
  });
});
// =============================================================================
// =======================    adminQuizTransfer   ==============================
// =============================================================================

describe('adminQuizTransfer Response Tests', () => {
  beforeEach(() => {
    clear();
  });
  test('Success Case: Quiz Transferred - Response Code 200', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(200);
    const user1SessionId1String = user1.bodyObj.token;
    expect(user1.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionIdNumber = Number(decodeURIComponent(user1.bodyObj.token));
    expect(sessionIdNumber).not.toBeNaN();
    const user2 = adminAuthRegister('sadat@gmail.com', '1234abcd', 'Galantis', 'Express');
    expect(user2.statusCode).toStrictEqual(200);
    const user2SessionId1String = user2.bodyObj.token;
    // adminQuizCreate - User1 Create Quiz1
    const quiz1 = adminQuizCreate(user1SessionId1String, 'quiz1namebyUser1', 'quiz1description');
    expect(quiz1.statusCode).toStrictEqual(200);
    const user1Quiz1IdNumber = quiz1.bodyObj.quizId;
    //* console.log(user1Quiz1IdNumber);
    //   console.log(user1SessionId1String);

    // Transfer Quiz1 owned by User1 to User 2
    let ownershipTransfer = adminQuizTransfer(user1Quiz1IdNumber, '999999999999999999999999', 'sadat@gmail.com');
    expect(ownershipTransfer.statusCode).toStrictEqual(401);
    ownershipTransfer = adminQuizTransfer(user1Quiz1IdNumber, user1SessionId1String, 'sadat@gmail.com');
    //   console.log(ownershipTransfer);
    expect(ownershipTransfer.statusCode).toStrictEqual(200);
    expect(ownershipTransfer.bodyObj).toStrictEqual({});
    const quizListUser2 = adminQuizList(user2SessionId1String);
    expect(quizListUser2.statusCode).toStrictEqual(200);
    expect(quizListUser2.bodyObj.quizzes.length).toStrictEqual(1);
    expect(quizListUser2.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: user1Quiz1IdNumber,
          name: 'quiz1namebyUser1'
        }
      ]
    });
    //* console.log(quizListUser2);
    //* console.log(quizListUser2.bodyObj.quizzes[0]);
  });
  test('Error Case: Invalid user - Response Code 400', () => {
    const token = adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun');
    expect(token.statusCode).toBe(200);
    const token1 = token.bodyObj.token;
    const quizId = adminQuizCreate(token1, 'Good Quiz', 'abcd').bodyObj.quizId;
    const transfer = adminQuizTransfer(quizId, token1, 'invalid@unsw.com');
    expect(transfer.statusCode).toBe(400);
    expect(transfer.bodyObj).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Case: User is the owner - Response Code 400', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj.token);
    const quiz = adminQuizCreate(token1, 'Good Quiz', 'abcd');
    const quizId = Number(decodeURIComponent(quiz.bodyObj.quizId));
    expect(adminQuizTransfer(quizId, token1, 'valid@unsw.com').statusCode).toBe(400);
  });

  test('Error Case: Quiz name already exists for target user - Response Code 400', () => {
    const user1 = adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun');
    const token1 = (user1.bodyObj.token);
    const quizId1 = adminQuizCreate(token1, 'Good Quiz', '').bodyObj.quizId;
    const user2 = adminAuthRegister('valid2@unsw.com', 'Password2', 'Taew', 'Yun');
    const token2 = (user2.bodyObj.token);
    const quiz = adminQuizCreate(token2, 'Good Quiz', '');
    const quizId2 = Number(decodeURIComponent(quiz.bodyObj.quizId));
    expect(quizId2).toStrictEqual(expect.any(Number));
    expect(adminQuizTransfer(quizId1, token1, 'valid2@unsw.com').statusCode).toBe(400);
  });

  test('Error Case: Token is empty or invalid - Response Code 401', () => {
    const token1: string = adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj.token;
    const quizId: number = adminQuizCreate(token1, 'Good Quiz', '').bodyObj.quizId;
    const result = adminQuizTransfer(quizId, ' ', 'valid@unsw.com');
    expect(result.statusCode).toBe(401);
    //* console.log(result.bodyObj);
  });

  test('Error Case: Quiz ID is invalid or user does not own the quiz - Response Code 403', () => {
    const token1: string = adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj.token;
    const quizId: number = adminQuizCreate(token1, 'Good Quiz', '').bodyObj.quizId;
    const token2 = adminAuthRegister('valid2@unsw.com', 'Password2', 'Taew', 'Yun').bodyObj.token;
    expect(adminQuizTransfer(quizId, token2, 'valid@unsw.com').statusCode).toBe(403);
  });
});
