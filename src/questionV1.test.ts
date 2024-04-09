import HTTPError from 'http-errors';
import { QuestionBody, answer } from './dataStore';
import {
  adminAuthRegister,
  adminQuizCreate,
  adminQuestionCreate,
  clear
} from './apiRequestsIter3';
import { UserCreateReturn/*, quizInfoV2Return */, QuizCreateReturn, QuestionCreateReturn } from './returnInterfaces';
beforeEach(() => {
  clear();
});
describe('test question create', () => {
  beforeEach(() => {
    clear();
  });
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answer3 = 'this is answer3';
  const answer4 = 'this is answer4';
  const answer5 = 'this is answer5';
  const answer6 = 'this is answer6';
  const answer7 = 'this is answer7';
  const shortAnswer = '';
  const longAnswer = 'this is a looooooooooooooong answer';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  const answerObj3: answer = { answer: answer3, correct: false };
  const answerObj4: answer = { answer: answer4, correct: false };
  const answerObj5: answer = { answer: answer5, correct: false };
  const answerObj6: answer = { answer: answer6, correct: false };
  const answerObj7: answer = { answer: answer7, correct: false };
  const shortAnswerObj: answer = { answer: shortAnswer, correct: false };
  const longAnswerObj: answer = { answer: longAnswer, correct: false };

  test('success create', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(token1.token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quizId, body).bodyObj as QuestionCreateReturn).questionId;
    expect(questionid).toStrictEqual(expect.any(Number));
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
      // inserts an invalid number as the token
    expect(() => adminQuestionCreate('999999', quizId, body)).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuestionCreate('happy', quizId, body)).toThrow(HTTPError[401]);
  });
  test('quizid is invalid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn);
    const sessionId1 = token1.token;
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn;
    const sessionId2 = token2.token;
    const quizId = (adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId2, quizId + 1, body)).toThrow(HTTPError[403]);
  });
  test('quizid doest match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId1 = token1.token;
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn;
    const sessionId2 = token2.token;
    const quizId = (adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId2, quizId, body)).toThrow(HTTPError[403]);
  });
  test('short question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('long question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('too little answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('too much answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('invalid duration', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    adminQuestionCreate(sessionId, quizId, body1);
    const answers2 = [answerObj3, answerObj4];
    const body2 : QuestionBody = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body2)).toThrow(HTTPError[400]);
  });
  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, shortAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, longAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('repeated answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj1];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quizId = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj2, answerObj3, answerObj4];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionCreate(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
});
