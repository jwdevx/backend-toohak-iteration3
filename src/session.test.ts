import {
  adminQuizCreate,
  adminAuthRegister,
  adminQuizSessionStart,
  clear,
  adminQuestionCreate,
  adminQuizRemove,
} from './apiRequests';
import { QuestionBody, answer } from './dataStore';
describe('create session', () => {
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  beforeEach(() => {
    clear();
  });
  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');
    const quizSession = adminQuizSessionStart('99999999', Quiz1.bodyObj.quizId, 3);
    expect(quizSession.statusCode).toStrictEqual(401);
    expect(quizSession.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
  });
  test('quiz owner doesnt match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token2 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');
    const quizSession = adminQuizSessionStart(token2.bodyObj.token, Quiz1.bodyObj.quizId, 3);
    expect(quizSession.statusCode).toStrictEqual(401);
  });
  test('autostartNum greater than 50', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');

    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    adminQuestionCreate(token1.bodyObj.token, Quiz1.bodyObj.quizId, body);
    const quizSession = adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 51);
    expect(quizSession.statusCode).toStrictEqual(400);
    expect(quizSession.bodyObj).toStrictEqual({ error: 'Autostart cannot be higher than 50' });
  });
  test('quiz has no questions', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');
    const quizSession = adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    expect(quizSession.statusCode).toStrictEqual(400);
    expect(quizSession.bodyObj).toStrictEqual({ error: 'The quiz does not have any questions.' });
  });
  test('quiz is in trash', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    adminQuestionCreate(token1.bodyObj.token, Quiz1.bodyObj.quizId, body);
    adminQuizRemove(token1.bodyObj.token, Quiz1.bodyObj.quizId);
    const quizSession = adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    expect(quizSession.statusCode).toStrictEqual(400);
    expect(quizSession.bodyObj).toStrictEqual({ error: 'The quiz is in trash.' });
  });
  test('more than 10 opening sessions', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    adminQuestionCreate(token1.bodyObj.token, Quiz1.bodyObj.quizId, body);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    const quizSession = adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    expect(quizSession.statusCode).toStrictEqual(400);
    expect(quizSession.bodyObj).toStrictEqual({ error: 'There are more than 10 session runing at the moment' });
  });
  test('successful start', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const Quiz1 = adminQuizCreate(token1.bodyObj.token, 'tests', 'autotesting');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    adminQuestionCreate(token1.bodyObj.token, Quiz1.bodyObj.quizId, body);
    const quizSession = adminQuizSessionStart(token1.bodyObj.token, Quiz1.bodyObj.quizId, 4);
    expect(quizSession.statusCode).toStrictEqual(200);
  });
});
