import HTTPError from 'http-errors';
import { QuestionBody, answer } from './dataStore';
import {
  adminAuthRegister,
  adminQuizCreate,
  adminQuestionCreate,
  adminQuestionUpdate,
  adminQuizInfo,
  adminQuestionRemove,
  adminQuestionMove,
  clear
} from './apiRequestsIter3';
import { UserCreateReturn, QuizCreateReturn, QuestionCreateReturn, quizInfoV1Return } from './returnInterfaces';
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
/// //////////////////////adminQuestionUpdate:///////////////
describe('test question Update', () => {
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
  const answer8 = 'this is answer8';
  const shortAnswer = '';
  const longAnswer = 'this is a looooooooooooooong answer';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  const answerObj3: answer = { answer: answer3, correct: false };
  const answerObj4: answer = { answer: answer4, correct: false };
  const answerObj5: answer = { answer: answer5, correct: false };
  const answerObj6: answer = { answer: answer6, correct: false };
  const answerObj7: answer = { answer: answer7, correct: false };
  const answerObj8: answer = { answer: answer8, correct: true };
  const shortAnswerObj: answer = { answer: shortAnswer, correct: false };
  const longAnswerObj: answer = { answer: longAnswer, correct: false };

  test('success create', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(adminQuizInfo(sessionId, quiz).bodyObj as quizInfoV1Return).toStrictEqual({
      quizId: quiz,
      name: 'quiz1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'first quiz',
      numQuestions: 1,
      questions: [{
        questionId: questionid,
        question: body1.question,
        duration: body1.duration,
        points: body1.points,
        answers: [{
          answer: answer8,
          answerId: expect.any(Number),
          colour: expect.any(String),
          correct: true,
        }, {
          answer: answer2,
          answerId: expect.any(Number),
          colour: expect.any(String),
          correct: false,
        }],
      }],
      duration: 4,
    });
    expect(questionUpdate.bodyObj).toStrictEqual({ });
  });
  test('invalid QuizId', () => {
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
    const questionid = (adminQuestionCreate(sessionId, quizId, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quizId + 1, questionid, body1)).toThrow(HTTPError[403]);
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const sessionId2 = (parseInt(decodeURIComponent(sessionId)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId2 + 1));
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const question = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(wrongtoken, quiz, question, body1)).toThrow(HTTPError[401]);
    // token passed in as a string
    expect(() => adminQuestionUpdate('happy', quiz, question, body)).toThrow(HTTPError[401]);
  });
  test('quizid doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn).token;
    const sessionId = decodeURIComponent(token1);
    const sessionId2 = decodeURIComponent(token2);
    const quiz1 = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreate(sessionId2, 'quiz2', 'second quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid1 = (adminQuestionCreate(sessionId, quiz1, body).bodyObj as QuestionCreateReturn).questionId;
    const questionid2 = (adminQuestionCreate(sessionId2, quiz2, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz2, questionid1, body1)).toThrow(HTTPError[403]);
    expect(() => adminQuestionUpdate(sessionId2, quiz1, questionid2, body1)).toThrow(HTTPError[403]);
  });
  test('short question length', () => {
    const sessionId = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;

    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: ans,
    };

    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('long question length', () => {
    const sessionId = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('too little answers', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const sessionId = decodeURIComponent(token1);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('too much answers', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const sessionId = decodeURIComponent(token1);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('invalid duration', () => {
    const sessionId = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('duration addition greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers2 = [answerObj3, answerObj4, answerObj1];
    const body2 : QuestionBody = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body2)).toThrow(HTTPError[400]);
  });
  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    // creating first question
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 140,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    // creating second question
    const answers2 = [answerObj2, answerObj1];
    const body2 : QuestionBody = {
      question: 'this is a test too',
      duration: 20,
      points: 5,
      answers: answers2,
    };
    const questionid2 = (adminQuestionCreate(sessionId, quiz, body2).bodyObj as QuestionCreateReturn).questionId;
    // updating the questions
    const answers3 = [answerObj1, answerObj4];
    const body3 : QuestionBody = {
      question: 'this is a test three',
      duration: 50,
      points: 5,
      answers: answers3,
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid2, body3)).toThrow(HTTPError[400]);
    expect(questionUpdate.bodyObj).toStrictEqual({ });
  });
  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;

    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, shortAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, longAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('repeated answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, answerObj1];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj2, answerObj3, answerObj4];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid = (adminQuestionCreate(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj3, answerObj4];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans,
    };
    expect(() => adminQuestionUpdate(sessionId, quiz, questionid + 1, body)).toThrow(HTTPError[400]);
  });
});
// =============================================================================
// =========================    adminQuestionRemove   ==========================
// =============================================================================

describe('test question remove', () => {
  beforeEach(() => {
    clear();
  });
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  test('correctly removes the given question', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizID = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const body2 : QuestionBody = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers,
    };
    // creating two questions
    const questionid1 = adminQuestionCreate(token, quizID, body1).bodyObj as QuestionCreateReturn;
    const questionid2 = adminQuestionCreate(token, quizID, body2).bodyObj as QuestionCreateReturn;
    const id1 = questionid1.questionId;
    const id2 = questionid2.questionId;
    // removing one of the two questions and matching expected behavior
    adminQuestionRemove(quizID, id1, token);
    expect(adminQuizInfo(token, quizID).bodyObj as quizInfoV1Return).toStrictEqual({
      quizId: quizID,
      name: 'quiz1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'first quiz',
      numQuestions: 1,
      questions: [{
        questionId: id2,
        question: body2.question,
        duration: body2.duration,
        points: body2.points,
        answers: [{
          answer: answer1,
          answerId: expect.any(Number),
          colour: expect.any(String),
          correct: true,
        }, {
          answer: answer2,
          answerId: expect.any(Number),
          colour: expect.any(String),
          correct: false,
        }],
      }],
      duration: 15,
    });
    // if that succeeds, then removes the last remaining question and checking for empty question
    const obj = adminQuestionRemove(quizID, id2, token);
    const info = adminQuizInfo(token, quizID).bodyObj as quizInfoV1Return;
    expect(info).toStrictEqual({
      quizId: quizID,
      name: 'quiz1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'first quiz',
      numQuestions: 0,
      questions: [],
      duration: 0,
    });
    expect(obj.bodyObj).toStrictEqual({});
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const id1 = (adminQuestionCreate(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    // inputs invalid question id by doing (id + 1) to the only valid id
    expect(() => adminQuestionRemove(quizId, id1 + 1, token)).toThrow(HTTPError[400]);
  });
  test('Token is empty or invalid (does not refer to valid logged in user session', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    // encodes a non-existent token by adding 1 to the only valid session id
    const sessionId = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));

    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const id1 = (adminQuestionCreate(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    expect(() => adminQuestionRemove(quizId, id1, wrongtoken)).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuestionRemove(quizId, id1, 'happy')).toThrow(HTTPError[401]);
  });
  test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid1 = adminQuestionCreate(token, quiz.quizId, body1).bodyObj as QuestionCreateReturn;
    const id1 = questionid1.questionId;
    expect(() => adminQuestionRemove(quiz.quizId, id1, token2.token)).toThrow(HTTPError[403]);
    expect(() => adminQuestionRemove(quiz.quizId + 100, id1, token1.token)).toThrow(HTTPError[403]);
  });
});
// =============================================================================
// =========================    adminQuestionMove   ============================
// =============================================================================
describe('test question move', () => {
  beforeEach(() => {
    clear();
  });
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };
  test('Testing correct functionality of adminQuestionMove', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const body2 : QuestionBody = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers,
    };
    const body3 : QuestionBody = {
      question: 'this is yet another test',
      duration: 5,
      points: 10,
      answers: answers,
    };
    const body4 : QuestionBody = {
      question: 'as you can guess, this is yet another test',
      duration: 5,
      points: 10,
      answers: answers,
    };
    const questionid0 = (adminQuestionCreate(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    const questionid1 = (adminQuestionCreate(token, quizId, body2).bodyObj as QuestionCreateReturn).questionId;
    const questionid2 = (adminQuestionCreate(token, quizId, body3).bodyObj as QuestionCreateReturn).questionId;
    const questionid3 = (adminQuestionCreate(token, quizId, body4).bodyObj as QuestionCreateReturn).questionId;
    // moving a question and verifying the resultant question indexes to the expected behavior
    const res = adminQuestionMove(quizId, questionid2, token, 0);
    expect(res.bodyObj).toStrictEqual({});
    let QuizInfo = adminQuizInfo(token, quizId).bodyObj as quizInfoV1Return;
    let questions = QuizInfo.questions;
    expect(questions[0].questionId).toStrictEqual(questionid2);
    expect(questions[1].questionId).toStrictEqual(questionid0);
    expect(questions[2].questionId).toStrictEqual(questionid1);
    expect(questions[3].questionId).toStrictEqual(questionid3);
    // performs another move and doing another verification
    const status = adminQuestionMove(quizId, questionid3, token, 2);
    QuizInfo = adminQuizInfo(token, quizId).bodyObj as quizInfoV1Return;
    questions = QuizInfo.questions;
    expect(questions[2].questionId).toStrictEqual(questionid3);
    expect(status.bodyObj).toStrictEqual({});
  });
  test('Testing valid new position', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const body2 : QuestionBody = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers,
    };
    const body3 : QuestionBody = {
      question: 'this is yet another test',
      duration: 5,
      points: 10,
      answers: answers,
    };
    const questionid0 = (adminQuestionCreate(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    const questionid1 = (adminQuestionCreate(token, quizId, body2).bodyObj as QuestionCreateReturn).questionId;
    const questionid2 = (adminQuestionCreate(token, quizId, body3).bodyObj as QuestionCreateReturn).questionId;
    // attempting to move it to outside the index
    expect(() => adminQuestionMove(quizId, questionid1, token, 4)).toThrow(HTTPError[400]);
    // attempting to move it to a negative index
    expect(() => adminQuestionMove(quizId, questionid0, token, -1)).toThrow(HTTPError[400]);
    /// move it to its original position
    expect(() => adminQuestionMove(quizId, questionid2, token, 2)).toThrow(HTTPError[400]);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const id1 = (adminQuestionCreate(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    // inputs an invalid question id by adding 1 to the only valid question id
    expect(() => adminQuestionMove(quizId, id1 + 1, token, 0)).toThrow(HTTPError[400]);
  });
  test('Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const sessionId = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));

    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const id1 = (adminQuestionCreate(token, quizId, body1) as QuestionCreateReturn).questionId;
    // passes in a wrong token by adding 1 to the only valid session id
    expect(() => adminQuestionMove(quizId, id1, wrongtoken, 0)).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuestionMove(quizId, id1, 'happy', 0)).toThrow(HTTPError[401]);
  });
  test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
    };
    const questionid1 = adminQuestionCreate(token, quizId, body1).bodyObj as QuestionCreateReturn;
    const id1 = questionid1.questionId;
    // inputting a valid quizId but not one corresponding to the given user's quizzes
    expect(() => adminQuestionMove(quizId, id1, token2.token, 0)).toThrow(HTTPError[403]);
    // inputting an invalid quizId by making it negative
    expect(() => adminQuestionMove(quizId * (-1), id1, token1.token, 0)).toThrow(HTTPError[403]);
  });
});
