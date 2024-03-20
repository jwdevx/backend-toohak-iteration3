import {
  adminAuthRegister,
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  // adminQuizNameUpdate,
  // adminQuizDescriptionUpdate
  clear
} from './apiRequests';

import {
  adminQuizRemove,
  // adminQuizTrashView,
  // adminQuizTrashRestore,
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

// TODO ASH ->
/*
describe('Testing QuizNameUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for AuthuserId is not a valid user
  test('invalid user id', () => {
    const authUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'BdDhK';
    const name2 = 'sami';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(authUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(authUser.authUserId + 1, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The user id is not valid.' });
  });

  // Testing for QuizId validity
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const description = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId + 1, name);
    expect(Update).toStrictEqual({ error: 'The quiz id is not valid.' });
  });

  // Testing for quiz ownership
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const autherUser1 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque');
    const name = 'sami';
    const description = 'test1';
    const name2 = 'Tumi';
    const name3 = 'Amra';
    const description2 = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const QuizCrt2 = adminQuizCreate(autherUser1.authUserId, name2, description2);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt2.quizId, name3);
    expect(Update).toStrictEqual({ error: 'Quiz belongs to a different user.' });
  });

  // Testing for name is not alphanumeric
  test('invalid name', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'BdDhk!@#?/iter1< ';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is not valid.' });
  });

  // Testing for name is too short
  test('short name', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'hi';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is either too long or too short.' });
  });

  // Testing for name is too long
  test('long name', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'hhhheeeeeeeeeeelllllllllllllllloooooooooooooooooo';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is either too long or too short.' });
  });

  // Testing for invalid name input
  test('name is empty', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = '';
    const description = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is either too long or too short.' });
  });

  // Testing for if the name is used by other user
  test('name is used', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'ami';
    const description = 'test2';
    const description2 = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const QuizCrt2 = adminQuizCreate(autherUser.authUserId, name2, description2);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The quiz name is already been used.' });
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'ami';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({});
  });
});

describe('Testing QuizDescriptionUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for AuthuserId is not a valid user
  test('invalid user id', () => {
    const authUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'BdDhK';
    const description = 'test2';
    const description2 = 'test1';
    const QuizCrt = adminQuizCreate(authUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(authUser.authUserId + 1, QuizCrt.quizId, description2);
    expect(Update).toStrictEqual({ error: 'The user id is not valid.' });
  });

  // Testing for QuizId validity
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const description = 'test1';
    const description2 = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt.quizId + 1, description2);
    expect(Update).toStrictEqual({ error: 'The quiz id is not valid.' });
  });

  // Testing for quiz ownership
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const autherUser1 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque');
    const name = 'sami';
    const description = 'test1';
    const name2 = 'ami';
    const description2 = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const QuizCrt2 = adminQuizCreate(autherUser1.authUserId, name2, description2);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt2.quizId, description2);
    expect(Update).toStrictEqual({ error: 'Quiz belongs to a different user.' });
  });

  // Testing for too long description
  test('long description', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'BdDhk';
    const description = 'test2';
    const description2 = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt.quizId, description2);
    expect(Update).toStrictEqual({ error: 'The description is too long.' });
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const description = 'test2';
    const description2 = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt.quizId, description2);
    expect(Update).toStrictEqual({});
  });
});
*/

// =============================================================================
// ======================    adminQuizDescriptionUpdate   ======================
// =============================================================================

// TODO ASH ->
/*
describe('Testing if adminQuizInfo prints the correct information', () => {
  beforeEach(() => {
    clear();
  });
  test('missing parameters', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const quizId = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(quizId.quizId)).toStrictEqual({ error: 'One or more missing parameters.' });
    expect(adminQuizInfo(authUser.authUserId)).toStrictEqual({ error: 'One or more missing parameters.' });
    expect(adminQuizInfo()).toStrictEqual({ error: 'One or more missing parameters.' });
  });
  test('invalid user id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const quizId = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(authUser.authUserId + 1, quizId.quizId)).toStrictEqual({ error: 'The user id is not valid.' });
  });
  test('invalid quiz id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const quizId = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(authUser.authUserId, quizId.quizId + 1)).toStrictEqual({ error: 'Quiz ID does not refer to a valid quiz.' });
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const authUser2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
    const name1 = 'test1';
    const description1 = 'test1';
    const quizobj1 = adminQuizCreate(authUser1.authUserId, name1, description1);
    const name2 = 'test2';
    const description2 = 'test2';
    const quizobj2 = adminQuizCreate(authUser2.authUserId, name2, description2);
    const quizId2 = quizobj2.quizId;
    const quizId1 = quizobj1.quizId;
    expect(adminQuizInfo(authUser2.authUserId, quizId1)).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(adminQuizInfo(authUser1.authUserId, quizId2)).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
  });
  test('Matching correct info', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'test1';
    const description = 'testing';
    const IDobj = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(authUser.authUserId, IDobj.quizId)).toStrictEqual({
      quizId: IDobj.quizId, name: 'test1', timeCreated: format(new Date(), 'MMMM d, yyyy h:mm a'), timeLastEdited: format(new Date(), 'MMMM d, yyyy h:mm a'), description: 'testing'
    });
  });
});
*/

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

/*
describe('Testing if adminQuizTrashView successfully views quiz in trash', () => {
  beforeEach(() => {
    clear();
  });
});
*/

// =============================================================================
// =======================    adminQuizTrashRestore    =========================
// =============================================================================

/*
describe('Testing for adminQuizTrashRestore successfully restore quiz in trash', () => {
  beforeEach(() => {
    clear();
  });

  // TODO if you have implemnted this function, could you please add it to  ****** below in adminQuizTrashEmpty
});
*/

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

    // TODO ****** test restore trash - ERROR, as quiz1 is permanent deleted and cannot be restored
  });
});
