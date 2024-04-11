test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});

import HTTPError from 'http-errors';

import {
  clear,
  adminAuthRegister,
  adminQuizListV2,
  adminQuizInfoV2,
  adminQuizNameUpdateV2,
  adminQuizDescriptionUpdateV2,
  adminQuizTransferV2,
  adminQuizCreateV2,
  adminQuizSessionStart,
  adminQuizSessionStateUpdate
} from './/apiRequestsIter3';

import {
  adminQuizRemoveV2,
  adminQuizTrashViewV2,
  adminQuizTrashRestoreV2,
  adminQuizTrashEmptyV2,
  adminQuizThumbnailUpdate,
  adminQuestionCreateV2
} from './/apiRequestsIter3';
import {
  UserCreateReturn, quizInfoV2Return, QuizCreateReturn, quizListReturn, quizTrashViewReturn,
  SessionCreateReturn, quizInfoV1Return
} from './returnInterfaces';
import { Action } from './dataStore';
import { QuestionBodyV2, answer } from './dataStore';

beforeEach(() => {
  clear();
});

// =============================================================================
// =========================    adminQuizCreateV2V2   ==============================
// =============================================================================

describe('Testing create quizzes return quiz id', () => {
  beforeEach(() => {
    clear();
  });
  test('Check successfully quiz addition', () => {
    const token1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz = adminQuizCreateV2(sessionId, 'yourname', 'yourdescription').bodyObj as QuizCreateReturn;
    const quizid = quiz.quizId;
    expect(quizid).toStrictEqual(expect.any(Number));
  });
  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    // inserts an invalid number as the token
    expect(() => adminQuizCreateV2(wrongtoken, 'tests', 'autotesting')).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuizCreateV2('happy', 'tests', 'autotesting')).toThrow(HTTPError[401]);
  });
  test('check invalid characters', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    expect(() => adminQuizCreateV2(sessionId, 'quiz@/500', 'i love autotests')).toThrow(HTTPError[400]);
  });
  test('check invalid name length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    expect(() => adminQuizCreateV2(sessionId, 'qq', 'quizzes are so fun')).toThrow(HTTPError[400]);
  });
  test('check used quiz names', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    expect(() => adminQuizCreateV2(sessionId, 'quiz1', 'quizzes are so fun')).toThrow(HTTPError[400]);
  });
  test('check invalid description length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const longdescription = 'a'.repeat(150);
    expect(() => adminQuizCreateV2(sessionId, 'quiz1', longdescription)).toThrow(HTTPError[400]);
  });
});

// =============================================================================
// =========================    adminQuizListV2   ================================
// =============================================================================

describe('Testing print quiz list return quizzes', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    adminQuizCreateV2(sessionId, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    const sessionId1 = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    expect(() => adminQuizListV2(wrongtoken)).toThrow(HTTPError[401]);
    expect(() => adminQuizListV2('happy')).toThrow(HTTPError[401]);
  });
  test('correct input without trash', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz1 = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(sessionId, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    const List = adminQuizListV2(sessionId).bodyObj as quizListReturn;
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
    const List = adminQuizListV2(sessionId).bodyObj as quizListReturn;
    expect(List).toStrictEqual({
      quizzes: []
    });
  });
});

// =============================================================================
// =========================     adminQuizInfoV2    ==============================
// =============================================================================

// TODO after quizupdate check error iteration1, timeCreated !== timelastEdited

describe('Testing get quiz info', () => {
  beforeEach(() => {
    clear();
  });
  test('Checks correct info and format ', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz1 = (adminQuizCreateV2(sessionId, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const id = quiz1;
    const quizinfo = adminQuizInfoV2(sessionId, quiz1).bodyObj as quizInfoV2Return;
    expect(quizinfo).toStrictEqual({
      quizId: id,
      name: 'quiz1name',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1description',
      numQuestions: 0,
      questions: [],
      duration: 0,
      thumbnailUrl: expect.any(String),
    });
  });
  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const sessionId1 = (parseInt(decodeURIComponent(token1.token)));
    const quiz1 = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    expect(() => adminQuizInfoV2(wrongtoken, quiz1)).toThrow(HTTPError[401]);
    expect(() => adminQuizInfoV2('happy', quiz1)).toThrow(HTTPError[401]);
  });
  test('quizId doesnt refer to valid quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizInfoV2(sessionId, quizId + 1)).toThrow(HTTPError[403]);
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng').bodyObj as UserCreateReturn).token;
    const name1 = 'test1';
    const description1 = 'test1';
    adminQuizCreateV2(token1, name1, description1).bodyObj as QuizCreateReturn;
    const name2 = 'test2';
    const description2 = 'test2';
    const quizId2 = (adminQuizCreateV2(token2, name2, description2).bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizInfoV2(token1, quizId2)).toThrow(HTTPError[403]);
  });
  test('testing time format', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quizId = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quizInfo = adminQuizInfoV2(token1, quizId).bodyObj as quizInfoV1Return;
    expect(quizInfo.timeCreated.toString()).toMatch(/^\d{10}$/);
    expect(quizInfo.timeLastEdited.toString()).toMatch(/^\d{10}$/);
  });
});

// =============================================================================
// =======================    adminQuizNameUpdateV2V2   ============================
// =============================================================================

describe('Testing QuizNameUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for invalid Token
  test('Check invalid token', () => {
    const user1 = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn;
    const sessionId = user1.token;
    const Quiz1 = (adminQuizCreateV2(sessionId, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const token = (parseInt(decodeURIComponent(user1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    expect(() => adminQuizNameUpdateV2(Quiz1, 'happy', 'quiz02')).toThrow(HTTPError[401]);
    expect(() => adminQuizNameUpdateV2(Quiz1, wrongtoken, 'quiz02')).toThrow(HTTPError[401]);
  });

  // Tesing for empty token
  test('Check empty token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const emptyToken = '';
    expect(() => adminQuizNameUpdateV2(Quiz1, emptyToken, 'quiz02')).toThrow(HTTPError[401]);
  });

  // Testing for quizId validity
  test('Check invalid Quiz ID', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(Quiz1 + 1, user1, 'quiz02')).toThrow(HTTPError[403]);
  });

  // Testing for quiz owner
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreateV2(user2, 'quiz02', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(Quiz1, user2, 'quiz3')).toThrow(HTTPError[403]);
    expect(() => adminQuizNameUpdateV2(Quiz2, user1, 'quiz4')).toThrow(HTTPError[403]);
  });

  // Testing for input character validity
  test('check invalid characters', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(Quiz1, user1, 'BdDhk!@#?/iter1<')).toThrow(HTTPError[400]);
  });

  // Testing for input character length
  test('check invalid name length', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(Quiz1, user1, 'hi')).toThrow(HTTPError[400]);
  });

  /// /Testing for input character length
  test('check invalid name length', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(Quiz1, user1, 'hhhheeeeeeeeeeelllllllllllllllloooooooooooooooooo')).toThrow(HTTPError[400]);
  });

  // Testing for invalid name input
  test('name is empty', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(Quiz1, user1, '')).toThrow(HTTPError[400]);
  });

  // Testing for quiz name duplicate
  test('check used quiz names', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    adminQuizCreateV2(user1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    const quiz = (adminQuizCreateV2(user1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizNameUpdateV2(quiz, user1, 'quiz1')).toThrow(HTTPError[400]);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const NameUpdate = adminQuizNameUpdateV2(Quiz1, user1, 'quiz20');
    const NameUpdateBody = NameUpdate.bodyObj;
    expect(NameUpdateBody).toStrictEqual({ });
  });
});

// =============================================================================
// ======================    adminQuizDescriptionUpdateV2   ======================
// =============================================================================

describe('Testing QuizDescriptionUpdate', () => {
  beforeEach(() => {
    clear();
  });

  test('Check invalid token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const token = (parseInt(decodeURIComponent(user1)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    expect(() => adminQuizDescriptionUpdateV2(Quiz1, wrongtoken, 'i hate autotests')).toThrow(HTTPError[401]);
  });

  test('Check invalid token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const emptyToken = '';
    expect(() => adminQuizDescriptionUpdateV2(Quiz1, emptyToken, 'i hate autotests')).toThrow(HTTPError[401]);
  });

  test('Check invalid Quiz ID', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizDescriptionUpdateV2(Quiz1 + 1, user1, 'i hate autotests')).toThrow(HTTPError[403]);
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreateV2(user2, 'quiz02', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizDescriptionUpdateV2(Quiz1, user2, 'i hate autotests')).toThrow(HTTPError[403]);
    expect(() => adminQuizDescriptionUpdateV2(Quiz2, user1, 'i hate autotests')).toThrow(HTTPError[403]);
  });

  // Testing for too long description
  test('long description', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const longdescription = 'a'.repeat(150);
    expect(() => adminQuizDescriptionUpdateV2(Quiz1, user1, longdescription)).toThrow(HTTPError[400]);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const DescriptionUpdate = adminQuizDescriptionUpdateV2(Quiz1, user1, 'quiz2');
    const DescriptionUpdateBody = DescriptionUpdate.bodyObj;
    expect(DescriptionUpdateBody).toStrictEqual({ });
  });
});
// =============================================================================
// =======================    adminQuizThumbnailUpdate   ============================
// =============================================================================
describe('Testing QuizThumbnailUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for invalid Token
  test('Check invalid token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const token = (parseInt(decodeURIComponent(user1)));
    const wrongtoken = encodeURIComponent(JSON.stringify(token + 1));
    expect(() => adminQuizThumbnailUpdate(wrongtoken, Quiz1, 'http://google.com/some/image/path.jpg')).toThrow(HTTPError[401]);
  });

  // Tesing for empty token
  test('Check empty token', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const emptyToken = '';
    expect(() => adminQuizThumbnailUpdate(emptyToken, Quiz1, 'http://google.com/some/image/path.jpg')).toThrow(HTTPError[401]);
  });

  // Testing for quizId validity
  test('Check invalid Quiz ID', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizThumbnailUpdate(user1, Quiz + 9999, 'http://google.com/some/image/path.jpg')).toThrow(HTTPError[403]);
  });

  // Testing for quiz owner
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const Quiz2 = (adminQuizCreateV2(user2, 'quiz02', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizThumbnailUpdate(user1, Quiz2, 'http://google.com/some/image/path.jpg')).toThrow(HTTPError[403]);
    expect(() => adminQuizThumbnailUpdate(user2, Quiz1, 'http://google.com/some/image/path.jpg')).toThrow(HTTPError[403]);
  });

  // Testing for input Url validity
  test('check invalid characters', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizThumbnailUpdate(user1, Quiz1, 'abcd://google.com/some/image/path.jpg')).toThrow(HTTPError[400]);
  });

  // Testing for input Url validity
  test('check invalid characters', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const Quiz1 = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizThumbnailUpdate(user1, Quiz1, 'http://google.com/some/image/path.hifi')).toThrow(HTTPError[400]);
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const user1 = (adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'Sami', 'Ashfaque').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreateV2(user1, 'quiz01', 'i love autotests').bodyObj as QuizCreateReturn).quizId;
    const ThumbnailUpdate = adminQuizThumbnailUpdate(user1, quiz, 'http://google.com/some/image/path.jpg');
    const ThumbnailUpdateBody = ThumbnailUpdate.bodyObj;
    expect(ThumbnailUpdateBody).toStrictEqual({ });
  });
});

// =============================================================================
// ===========================    QUIZ TRASH    ================================
// =============================================================================
// =========================    adminQuizRemoveV2   ==============================
// =============================================================================

describe('Testing if adminQuizRemoveV2 successfully removes the given quiz', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };

    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const sessionId1 = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId1 + 1));
    const quiz1 = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(sessionId, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuestionCreateV2(sessionId, quiz1, body);
    const sessionId2 = (adminQuizSessionStart(sessionId, quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(sessionId, quiz1, sessionId2, Action.END);
    expect(() => adminQuizRemoveV2(wrongtoken, quiz1)).toThrow(HTTPError[401]);
    expect(() => adminQuizRemoveV2('happy', quiz1)).toThrow(HTTPError[401]);
  });
  test('invalid quiz id', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuestionCreateV2(token1, quiz1, body);
    const sessionId = (adminQuizSessionStart(token1, quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token1, quiz1, sessionId, Action.END);
    expect(() => adminQuizRemoveV2(token1, quiz1 + 9999)).toThrow(HTTPError[403]);
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token2, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuestionCreateV2(token1, quiz1, body);
    const sessionId = (adminQuizSessionStart(token1, quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token1, quiz1, sessionId, Action.END);
    expect(() => adminQuizRemoveV2(token2, quiz1)).toThrow(HTTPError[403]);
  });

  test('Any session for this quiz is not in END state', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quiz1, body);
    adminQuizSessionStart(token1, quiz1, 4).bodyObj as SessionCreateReturn;
    expect(() => adminQuizRemoveV2(token1, quiz1)).toThrow(HTTPError[400]);
  });

  test('Successfully removed a quiz', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };

    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quiz1, body);

    const quizSessionsId = (adminQuizSessionStart(token1, quiz1, 30).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token1, quiz1, quizSessionsId, 'END');
    adminQuizRemoveV2(token1, quiz1);
    const list = adminQuizListV2(token1).bodyObj as quizListReturn;
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
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz3 = (adminQuizCreateV2(token1, 'quiz3', 'third quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quiz1, body);
    const quizSessionsId = (adminQuizSessionStart(token1, quiz1, 30).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token1, quiz1, quizSessionsId, 'END');
    adminQuizRemoveV2(token1, quiz1);
    adminQuizRemoveV2(token1, quiz2);
    const list = adminQuizListV2(token1).bodyObj as quizListReturn;
    expect(list).toStrictEqual({
      quizzes: [
        {
          quizId: quiz3,
          name: 'quiz3',
        }
      ]
    });
  });
  test('testing the return type of adminQuizRemoveV2', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quiz1, body);
    const quizSessionsId = (adminQuizSessionStart(token1, quiz1, 30).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token1, quiz1, quizSessionsId, 'END');
    const remove = adminQuizRemoveV2(token1, quiz1);
    expect(remove.bodyObj).toStrictEqual({});
  });
});
// =============================================================================
// =======================    adminQuizTrashViewV2    ============================
// =============================================================================

describe('Testing if adminQuizTrashViewV2 successfully views quiz in trash', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token1, 'quiz2', 'Second quiz');
    adminQuizRemoveV2(token1, quiz1);
    expect(() => adminQuizTrashViewV2('9999999999')).toThrow(HTTPError[401]);
    expect(() => adminQuizTrashViewV2('happy')).toThrow(HTTPError[401]);
  });
  test('correct input', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizRemoveV2(token1, quiz1);
    const trash = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
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
// =======================    adminQuizTrashRestoreV2    =========================
// =============================================================================

describe('Testing for adminQuizTrashRestoreV2 successfully restore quiz in trash', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token1, 'quiz2', 'Second quiz');
    adminQuizRemoveV2(token1, quiz1);
    const trash1 = (adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn);
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestoreV2('99999999', quiz1)).toThrow(HTTPError[401]);
    const trash2 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
    expect(trash2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestoreV2('happy', quiz1)).toThrow(HTTPError[401]);
  });
  test('quizid invalid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token1, 'quiz2', 'Second quiz');
    adminQuizRemoveV2(token1, quiz1);
    const trash1 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestoreV2(token1, quiz1 + 99999)).toThrow(HTTPError[403]);
    const trash2 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
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
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token2, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuizRemoveV2(token1, quiz1);
    const trash1 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestoreV2(token2, quiz1)).toThrow(HTTPError[403]);
    const trash2 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
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
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizRemoveV2(token1, quiz1);
    const trash1 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    expect(() => adminQuizTrashRestoreV2(token1, quiz2)).toThrow(HTTPError[400]);
    const trash2 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
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
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuizRemoveV2(token1, quiz1);
    const trash1 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    adminQuizCreateV2(token1, 'quiz1', 'third quiz');
    expect(() => adminQuizTrashRestoreV2(token1, quiz1)).toThrow(HTTPError[400]);
    const trash2 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
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
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuizCreateV2(token1, 'quiz2', 'Second quiz').bodyObj as QuizCreateReturn;
    adminQuizRemoveV2(token1, quiz1);
    const trash1 = adminQuizTrashViewV2(token1).bodyObj as quizTrashViewReturn;
    expect(trash1).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1'
        }
      ]
    });
    const restore = adminQuizTrashRestoreV2(token1, quiz1);
    expect(restore.bodyObj).toStrictEqual({});
    const trash2 = adminQuizTrashViewV2(token1);
    expect(trash2.bodyObj).toStrictEqual({ quizzes: [] });
  });
});

// =============================================================================
// =======================    adminQuizTrashEmptyV2    ===========================
// =============================================================================

describe('Testing if able to remove trash permanently using adminQuizTrashEmptyV2', () => {
  beforeEach(() => {
    clear();
  });
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const user1 = (adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd1', 'Haydena', 'Smitha').bodyObj as UserCreateReturn).token;
    const user2 = (adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd2', 'Haydenb', 'Smithb').bodyObj as UserCreateReturn).token;

    // Create Quiz only by User1
    const quiz1 = (adminQuizCreateV2(user1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(user1, 'quiz2name', 'quiz2description').bodyObj as QuizCreateReturn).quizId;

    // Put Quiz 1 in trash
    adminQuizRemoveV2(user1, quiz1);

    // Error 401 'Token is empty or not provided'
    expect(() => adminQuizTrashEmptyV2('', JSON.stringify([quiz1]))).toThrow(HTTPError[401]);

    // Error 401
    expect(() => adminQuizTrashEmptyV2('9999999999999', JSON.stringify([quiz1]))).toThrow(HTTPError[401]);

    // Error 400 'quizIds must be numbers'
    expect(() => adminQuizTrashEmptyV2(user1, JSON.stringify(['asgjk']))).toThrow(HTTPError[403]);

    // Error 400  'One or more of the Quiz IDs is not currently in the trash'
    expect(() => adminQuizTrashEmptyV2(user1, JSON.stringify([quiz1, quiz2]))).toThrow(HTTPError[400]);

    // Error 403 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner'
    expect(() => adminQuizTrashEmptyV2(user2, JSON.stringify([quiz1]))).toThrow(HTTPError[403]);

    // 200 - success permanently delete
    const emptyRes4 = adminQuizTrashEmptyV2(user1, JSON.stringify([quiz1]));
    expect(emptyRes4.bodyObj).toStrictEqual({});

    expect(() => adminQuizTrashRestoreV2(user1, quiz1)).toThrow(HTTPError[403]);
  });
});

// =============================================================================
// =======================    adminQuizTransferV2   ==============================
// =============================================================================

describe('adminQuizTransferV2 Response Tests', () => {
  beforeEach(() => {
    clear();
  });
  test('Success Case: Quiz Transferred - Response Code 200', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answer3 = 'this is answer3';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answerObj3: answer = { answer: answer3, correct: false };
    const answers1 = [answerObj1, answerObj2];
    const answers2 = [answerObj1, answerObj3];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const body2 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers2,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const user1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn);
    expect(user1).toStrictEqual({ token: expect.any(String) });
    const User1 = user1.token;
    const sessionIdNumber = Number(decodeURIComponent(User1));
    expect(sessionIdNumber).not.toBeNaN();
    const user2 = (adminAuthRegister('sadat@gmail.com', '1234abcd', 'Galantis', 'Express').bodyObj as UserCreateReturn).token;
    // adminQuizCreateV2 - User1 Create Quiz1
    const quiz1 = (adminQuizCreateV2(User1, 'quiz1namebyUser1', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(user2, 'quiz1namebyUser2', 'quiz1descriptio2').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(User1, quiz1, body1);
    adminQuestionCreateV2(user2, quiz2, body2);
    const sessionId = (adminQuizSessionStart(User1, quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(User1, quiz1, sessionId, Action.END);
    const sessionId1 = (adminQuizSessionStart(user2, quiz2, 4).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(user2, quiz2, sessionId1, Action.END);

    // Transfer Quiz1 owned by User1 to User 2
    expect(() => adminQuizTransferV2(quiz1, '999999999999999999999999', 'sadat@gmail.com')).toThrow(HTTPError[401]);

    const ownershipTransfer = adminQuizTransferV2(quiz1, User1, 'sadat@gmail.com');
    expect(ownershipTransfer.bodyObj).toStrictEqual({});
    const quizListUser2 = adminQuizListV2(user2).bodyObj as quizListReturn;
    expect(quizListUser2.quizzes.length).toStrictEqual(2);
    expect(quizListUser2).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1namebyUser1'
        },
        {
          quizId: quiz2,
          name: 'quiz1namebyUser2'
        }
      ]
    });
  });
  test('Error Case: Invalid user - Response Code 400', () => {
    const token = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId = (adminQuizCreateV2(token, 'Good Quiz', 'abcd').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizTransferV2(quizId, token, 'invalid@unsw.com')).toThrow(HTTPError[400]);
  });

  test('Error Case: User is the owner - Response Code 400', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreateV2(token1, 'Good Quiz', 'abcd').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizTransferV2(quiz, token1, 'valid@unsw.com')).toThrow(HTTPError[400]);
  });

  test('Error Case: Quiz name already exists for target user - Response Code 400', () => {
    const user1 = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreateV2(user1, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    const user2 = (adminAuthRegister('valid2@unsw.com', 'Password2', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreateV2(user2, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    expect(quiz).toStrictEqual(expect.any(Number));
    expect(() => adminQuizTransferV2(quizId1, user1, 'valid2@unsw.com')).toThrow(HTTPError[400]);
  });

  test('Any session for this quiz is not in END state', () => {
    const answer1 = 'this is answer1';
    const answer2 = 'this is answer2';
    const answerObj1: answer = { answer: answer1, correct: true };
    const answerObj2: answer = { answer: answer2, correct: false };
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz1 = (adminQuizCreateV2(token1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quiz1, body1);
    const sessionId = (adminQuizSessionStart(token1, quiz1, 4).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token1, quiz1, sessionId, Action.NEXT_QUESTION);
    expect(() => adminQuizTransferV2(quiz1, token1, 'sadat@gmail.com')).toThrow(HTTPError[400]);
  });

  test('Error Case: Token is empty or invalid - Response Code 401', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId: number = (adminQuizCreateV2(token1, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    expect(() => adminQuizTransferV2(quizId, ' ', 'valid@unsw.com')).toThrow(HTTPError[401]);
  });

  test('Error Case: Quiz ID is invalid or user does not own the quiz - Response Code 403', () => {
    const token1: string = (adminAuthRegister('valid@unsw.com', 'Password1', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    const quizId: number = (adminQuizCreateV2(token1, 'Good Quiz', '').bodyObj as QuizCreateReturn).quizId;
    const token2 = (adminAuthRegister('valid2@unsw.com', 'Password2', 'Taew', 'Yun').bodyObj as UserCreateReturn).token;
    expect(() => adminQuizTransferV2(quizId, token2, 'valid@unsw.com')).toThrow(HTTPError[403]);
  });
});
