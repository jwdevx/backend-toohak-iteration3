import { error } from "console";
import { adminAuthRegister, adminQuestionCreate, adminQuizCreate, clear } from "./apiRequests"
import { QuestionBody, answer } from "./dataStore"

const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

describe('test question create', () => {
  beforeEach(() => {
    clear()
  })
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({questionId: expect.any(Number)})
    expect(questionid.statusCode).toStrictEqual(OK)
  })
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const question = adminQuestionCreate('999999', quiz.bodyObj.quizId, body)
    expect(question.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(question.statusCode).toStrictEqual(UNAUTHORIZED);
  })
  test('quizid doest match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId1 = decodeURIComponent(token1.bodyObj.token);
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong');
    const sessionId2 = decodeURIComponent(token2.bodyObj.token);
    const quiz = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId2, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'Quiz ID does not refer to a quiz that this user owns.'})
    expect(questionid.statusCode).toStrictEqual(FORBIDDEN)
  })
  test('short question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The question length is either too long or too short.'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('long question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The question length is either too long or too short.'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('too little answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The answers is either too much or too little.'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('too much answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The answers is either too much or too little.'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('invalid duration', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The duration should be positive number'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers1 = [answerObj1, answerObj2]
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    }
    const questionid1 = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body1)
    const answers2 = [answerObj3, answerObj4]
    const body2 : QuestionBody = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2
    }
    const questionid2 = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body2)
    expect(questionid2.bodyObj).toStrictEqual({error: 'The sum of the duration should be less than 3 min'})
    expect(questionid2.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The points is either too high or too low'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'The points is either too high or too low'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, shortAnswerObj]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'Answer string should be longer than 1 charcters, shorter than 30 charcters'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, longAnswerObj]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'Answer string should be longer than 1 charcters, shorter than 30 charcters'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('repeate answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj1]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'An answer is a duplicate of the other'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj2, answerObj3, answerObj4]
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    }
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body)
    expect(questionid.bodyObj).toStrictEqual({error: 'There should be at least one correct answer.'})
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST)
  })
})