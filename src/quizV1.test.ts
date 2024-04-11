test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});

import HTTPError from 'http-errors';
import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
} from './apiRequestsIter3';

import {
  adminQuizRemove,
  adminQuizTrashView,
  adminQuizTrashRestore,
  adminQuizTrashEmpty,
} from './apiRequestsIter3';

import { UserCreateReturn/*, quizInfoV2Return */, QuizCreateReturn, quizListReturn, quizTrashViewReturn, quizInfoV1Return } from './returnInterfaces';

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
    const token1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz = adminQuizCreate(sessionId, 'yourname', 'yourdescription').bodyObj as QuizCreateReturn;
    const quizid = quiz.quizId;
    expect(quizid).toStrictEqual(expect.any(Number));
  });
  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    // inserts an invalid number as the token
    expect(() => adminQuizCreate(wrongtoken, 'tests', 'autotesting')).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuizCreate('happy', 'tests', 'autotesting')).toThrow(HTTPError[401]);
  });
  test('check invalid characters', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    expect(() => adminQuizCreate(sessionId, 'quiz@/500', 'i love autotests')).toThrow(HTTPError[400]);
  });
  test('check invalid name length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    expect(() => adminQuizCreate(sessionId, 'qq', 'quizzes are so fun')).toThrow(HTTPError[400]);
  });
  test('check used quiz names', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    expect(() => adminQuizCreate(sessionId, 'quiz1', 'quizzes are so fun')).toThrow(HTTPError[400]);
  });
  test('check invalid description length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const longdescription = 'a'.repeat(150);
    expect(() => adminQuizCreate(sessionId, 'quiz1', longdescription)).toThrow(HTTPError[400]);
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    const sessionId1 = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    expect(() => adminQuizList(wrongtoken)).toThrow(HTTPError[401]);
    expect(() => adminQuizList('happy')).toThrow(HTTPError[401]);
  });
  test('correct input without trash', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz1 = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreate(sessionId, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    const List = adminQuizList(sessionId).bodyObj as quizListReturn;
    expect(List).toStrictEqual({
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const List = adminQuizList(sessionId).bodyObj as quizListReturn;
    expect(List).toStrictEqual({
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz1 = (adminQuizCreate(sessionId, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const id = quiz1;
    const quizinfo = adminQuizInfo(sessionId, quiz1).bodyObj as quizInfoV1Return;
    expect(quizinfo).toStrictEqual({
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const sessionId1 = (parseInt(decodeURIComponent(token1.token)));
    const quiz1 = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    expect(() => adminQuizInfo(wrongtoken, quiz1)).toThrow(HTTPError[401]);
    expect(() => adminQuizInfo('happy', quiz1)).toThrow(HTTPError[401]);
  });
  test('quizId doesnt refer to valid quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizInfo(sessionId, quizId + 1)).toThrow(HTTPError[403]);
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng').bodyObj as UserCreateReturn).token;
    const name1 = 'test1';
    const description1 = 'test1';
    adminQuizCreate(token1, name1, description1).bodyObj as QuizCreateReturn;
    const name2 = 'test2';
    const description2 = 'test2';
    const quizId2 = (adminQuizCreate(token2, name2, description2).bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizInfo(token1, quizId2)).toThrow(HTTPError[403]);
  });
  test('testing time format', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quizId = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quizInfo = adminQuizInfo(token1, quizId).bodyObj as quizInfoV1Return;
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
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn;
    const sessionId = user1.token;
    const Quiz1 = (adminQuizCreate(sessionId, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const token = (parseInt(decodeURIComponent(user1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    expect(() => adminQuizNameUpdate(Quiz1, 'happy', 'quiz02')).toThrow(HTTPError[401]);
    expect(() => adminQuizNameUpdate(Quiz1, wrongtoken, 'quiz02')).toThrow(HTTPError[401]);
  });

  // Tesing for empty token
  test('Check empty token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const emptyToken = '';
    expect(() => adminQuizNameUpdate(Quiz1, emptyToken, 'quiz02')).toThrow(HTTPError[401]);
  });

  // Testing for quizId validity
  test('Check invalid Quiz ID', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(Quiz1 + 1, user1, 'quiz02')).toThrow(HTTPError[403]);
  });

  // Testing for quiz owner
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreate(user2, 'quiz02', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(Quiz1, user2, 'quiz3')).toThrow(HTTPError[403]);
    expect(() => adminQuizNameUpdate(Quiz2, user1, 'quiz4')).toThrow(HTTPError[403]);
  });

  // Testing for input character validity
  test('check invalid characters', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(Quiz1, user1, 'BdDhk!@#?/iter1<')).toThrow(HTTPError[400]);
  });

  // Testing for input character length
  test('check invalid name length', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(Quiz1, user1, 'hi')).toThrow(HTTPError[400]);
  });

  /// /Testing for input character length
  test('check invalid name length', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(Quiz1, user1, 'hhhheeeeeeeeeeelllllllllllllllloooooooooooooooooo')).toThrow(HTTPError[400]);
  });

  // Testing for invalid name input
  test('name is empty', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(Quiz1, user1, '')).toThrow(HTTPError[400]);
  });

  // Testing for quiz name duplicate
  test('check used quiz names', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    adminQuizCreate(user1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    const quiz = (adminQuizCreate(user1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdate(quiz, user1, 'quiz1')).toThrow(HTTPError[400]);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const NameUpdate = adminQuizNameUpdate(Quiz1, user1, 'quiz20');
    const NameUpdateBody = NameUpdate.bodyObj;
    expect(NameUpdateBody).toStrictEqual({ });
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
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const token = (parseInt(decodeURIComponent(user1)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    expect(() => adminQuizDescriptionUpdate(Quiz1, wrongtoken, 'i hate autotests')).toThrow(HTTPError[401]);
  });

  test('Check invalid token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const emptyToken = '';
    expect(() => adminQuizDescriptionUpdate(Quiz1, emptyToken, 'i hate autotests')).toThrow(HTTPError[401]);
  });

  test('Check invalid Quiz ID', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizDescriptionUpdate(Quiz1 + 1, user1, 'i hate autotests')).toThrow(HTTPError[403]);
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreate(user2, 'quiz02', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizDescriptionUpdate(Quiz1, user2, 'i hate autotests')).toThrow(HTTPError[403]);
    expect(() => adminQuizDescriptionUpdate(Quiz2, user1, 'i hate autotests')).toThrow(HTTPError[403]);
  });

  // Testing for too long description
  test('long description', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const longdescription = 'a'.repeat(150);
    expect(() => adminQuizDescriptionUpdate(Quiz1, user1, longdescription)).toThrow(HTTPError[400]);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreate(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const DescriptionUpdate = adminQuizDescriptionUpdate(Quiz1, user1, 'quiz2');
    const DescriptionUpdateBody = DescriptionUpdate.bodyObj;
    expect(DescriptionUpdateBody).toStrictEqual({ });
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const sessionId1 = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    const quiz1 = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    expect(() => adminQuizRemove(wrongtoken, quiz1)).toThrow(HTTPError[401]);
    expect(() => adminQuizRemove('happy', quiz1)).toThrow(HTTPError[401]);
  });
  test('invalid quiz id', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    expect(() => adminQuizRemove(token1, quiz1 + 9999)).toThrow(HTTPError[403]);
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token2, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    expect(() => adminQuizRemove(token2, quiz1)).toThrow(HTTPError[403]);
  });
  test('Successfully removed a quiz', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreate(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizRemove(token1, quiz1);
    const list = adminQuizList(token1).bodyObj as quizListReturn;
    expect(list).toStrictEqual({
      quizzes: [
        {
          quizId: quiz2,
          name: 'quiz2',
        }
      ]
    });
  });
  test('Successfully removed multiple quizzes', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreate(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz3 = (adminQuizCreate(token1, 'quiz3', 'third quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizRemove(token1, quiz1);
    adminQuizRemove(token1, quiz2);
    const list = adminQuizList(token1).bodyObj as quizListReturn;
    expect(list).toStrictEqual({
      quizzes: [
        {
          quizId: quiz3,
          name: 'quiz3',
        }
      ]
    });
  });
  test('testing the return type of adminQuizRemove', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const remove = adminQuizRemove(token1, quiz1);
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
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token1, 'quiz2', 'Second quiz');
    adminQuizRemove(token1, quiz1);
    expect(() => adminQuizTrashView('9999999999')).toThrow(HTTPError[401]);
    expect(() => adminQuizTrashView('happy')).toThrow(HTTPError[401]);
  });
  test('correct input', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizRemove(token1, quiz1);
    const trash = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
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
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token1, 'quiz2', 'Second quiz');
    adminQuizRemove(token1, quiz1);
    const trash1 = (adminQuizTrashView(token1).bodyObj as quizTrashViewReturn);
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestore('99999999', quiz1)).toThrow(HTTPError[401]);
    const trash2 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestore('happy', quiz1)).toThrow(HTTPError[401]);
  });
  test('quizid invalid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token1, 'quiz2', 'Second quiz');
    adminQuizRemove(token1, quiz1);
    const trash1 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestore(token1, quiz1 + 99999)).toThrow(HTTPError[403]);
    const trash2 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
  });
  test('user does not own the quiz', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'tony', 'kkkk').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token2, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuizRemove(token1, quiz1);
    const trash1 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestore(token2, quiz1)).toThrow(HTTPError[403]);
    const trash2 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
  });
  test('quiz is not in trash', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreate(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizRemove(token1, quiz1);
    const trash1 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestore(token1, quiz2)).toThrow(HTTPError[400]);
    const trash2 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
  });
  test('quiz name is used', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuizRemove(token1, quiz1);
    const trash1 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    adminQuizCreate(token1, 'quiz1', 'third quiz');
    expect(() => adminQuizTrashRestore(token1, quiz1)).toThrow(HTTPError[400]);
    const trash2 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
  });
  test('correct inputs', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreate(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreate(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuizRemove(token1, quiz1);
    const trash1 = adminQuizTrashView(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestore(token1, quiz1);
    expect(restore.bodyObj).toStrictEqual({});
    const trash2 = adminQuizTrashView(token1);
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
    const user1 = (adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd1', 'Haydena', 'Smitha').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd2', 'Haydenb', 'Smithb').bodyObj as UserCreateReturn).token;

    // Create Quiz only by User1
    const quiz1 = (adminQuizCreate(user1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreate(user1, 'quiz2name', 'quiz2description').bodyObj as QuizCreateReturn).quizId;

    // Put Quiz 1 in trash
    adminQuizRemove(user1, quiz1);

    // Error 401 'Token is empty or not provided'
    expect(() => adminQuizTrashEmpty('', JSON.stringify([quiz1]))).toThrow(HTTPError[401]);

    // Error 401
    expect(() => adminQuizTrashEmpty('9999999999999', JSON.stringify([quiz1]))).toThrow(HTTPError[401]);

    // Error 400 'quizIds must be numbers'
    expect(() => adminQuizTrashEmpty(user1, JSON.stringify(['asgjk']))).toThrow(HTTPError[403]);

    // Error 400  'One or more of the Quiz IDs is not currently in the trash'
    expect(() => adminQuizTrashEmpty(user1, JSON.stringify([quiz1, quiz2]))).toThrow(HTTPError[400]);

    // Error 403 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner'
    expect(() => adminQuizTrashEmpty(user2, JSON.stringify([quiz1]))).toThrow(HTTPError[403]);

    // 200 - success permanently delete
    const emptyRes4 = adminQuizTrashEmpty(user1, JSON.stringify([quiz1]));
    expect(emptyRes4.bodyObj).toStrictEqual({});

    expect(() => adminQuizTrashRestore(user1, quiz1)).toThrow(HTTPError[403]);
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
    const user1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn);
    const User1 = user1.token;
    expect(user1).toStrictEqual({ token: expect.any(String) });
    const sessionIdNumber = Number(decodeURIComponent(User1));
    expect(sessionIdNumber).not.toBeNaN();
    const user2 = (adminAuthRegister('sadat@gmail.com', '1234abcd', 'Galantis', 'Express').bodyObj as UserCreateReturn).token;
    // adminQuizCreate - User1 Create Quiz1
    const quiz1 = (adminQuizCreate(User1, 'quiz1namebyUser1', 'quiz1description').bodyObj as QuizCreateReturn).quizId;

    // Transfer Quiz1 owned by User1 to User 2
    expect(() => adminQuizTransfer(quiz1, '999999999999999999999999', 'sadat@gmail.com')).toThrow(HTTPError[401]);

    const ownershipTransfer = adminQuizTransfer(quiz1, User1, 'sadat@gmail.com');
    expect(ownershipTransfer.bodyObj).toStrictEqual({});
    const quizListUser2 = adminQuizList(user2).bodyObj as quizListReturn;
    expect(quizListUser2.quizzes.length).toStrictEqual(1);
    expect(quizListUser2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1namebyUser1'
        }
      ]
    });
  });
  test('Error Case: Invalid user - Response Code 400', () => {
    const token = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId = (adminQuizCreate(token, 'Good Quiz', 'abcd').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizTransfer(quizId, token, 'invalid@unsw.com')).toThrow(HTTPError[400]);
  });

  test('Error Case: User is the owner - Response Code 400', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreate(token1, 'Good Quiz', 'abcd').bodyObj as QuizCreateReturn).quizId;
    // const quizid = Number(decodeURIComponent(quiz.quizId));
    expect(() => adminQuizTransfer(quiz, token1, 'valid@unsw.com')).toThrow(HTTPError[400]);
  });

  test('Error Case: Quiz name already exists for target user - Response Code 400', () => {
    const user1 = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(user1, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    const user2 = (adminAuthRegister('valid2@unsw.com', 'Password2', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreate(user2, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    // const quizId2 = Number(decodeURIComponent(quiz));
    expect(quiz).toStrictEqual(expect.any(Number));
    expect(() => adminQuizTransfer(quizId1, user1, 'valid2@unsw.com')).toThrow(HTTPError[400]);
  });

  test('Error Case: Token is empty or invalid - Response Code 401', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId: number = (adminQuizCreate(token1, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizTransfer(quizId, ' ', 'valid@unsw.com')).toThrow(HTTPError[401]);
  });

  test('Error Case: Quiz ID is invalid or user does not own the quiz - Response Code 403', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId: number = (adminQuizCreate(token1, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    const token2 = (adminAuthRegister('valid2@unsw.com', 'Password2', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    expect(() => adminQuizTransfer(quizId, token2, 'valid@unsw.com')).toThrow(HTTPError[403]);
  });
});
