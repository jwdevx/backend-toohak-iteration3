import HTTPError from 'http-errors';
import { QuestionBodyV2, answer } from './dataStore';
import {
  adminAuthRegister,
  adminQuizCreateV2,
  adminQuestionCreateV2,
  adminQuestionUpdateV2,
  adminQuizInfoV2,
  adminQuestionRemoveV2,
  adminQuizSessionStateUpdate,
  adminQuizSessionStart,
  adminQuestionMoveV2,
  clear
} from './apiRequestsIter3';
import { UserCreateReturn, QuizCreateReturn, QuestionCreateReturn, quizInfoV2Return, SessionCreateReturn } from './returnInterfaces';
beforeEach(() => {
  clear();
});
/// /////////////////AdminQuestionCreate://////////////
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
    const quizId = (adminQuizCreateV2(token1.token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    const questionid = (adminQuestionCreateV2(sessionId, quizId, body).bodyObj as QuestionCreateReturn).questionId;
    expect(questionid).toStrictEqual(expect.any(Number));
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
      // inserts an invalid number as the token
    expect(() => adminQuestionCreateV2('999999', quizId, body)).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuestionCreateV2('happy', quizId, body)).toThrow(HTTPError[401]);
  });
  test('quizid is invalid', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn);
    const sessionId1 = token1.token;
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn;
    const sessionId2 = token2.token;
    const quizId = (adminQuizCreateV2(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png',
    };
    expect(() => adminQuestionCreateV2(sessionId2, quizId + 1, body)).toThrow(HTTPError[403]);
  });
  test('quizid doest match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId1 = token1.token;
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn;
    const sessionId2 = token2.token;
    const quizId = (adminQuizCreateV2(sessionId1, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId2, quizId, body)).toThrow(HTTPError[403]);
  });
  test('short question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('long question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('too little answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('too much answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('invalid duration', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    adminQuestionCreateV2(sessionId, quizId, body1);
    const answers2 = [answerObj3, answerObj4];
    const body2 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body2)).toThrow(HTTPError[400]);
  });
  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, shortAnswerObj];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, longAnswerObj];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('repeated answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj1];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj2, answerObj3, answerObj4];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
  });
  test('invalid URL', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3',
    };
    const body2 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: '1531Iteration3.jpeg',
    };
    const body3 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: '.jpeg1531https://Iteration3',
    };
    // inserts an invalid number as the token
    expect(() => adminQuestionCreateV2(sessionId, quizId, body)).toThrow(HTTPError[400]);
    expect(() => adminQuestionCreateV2(sessionId, quizId, body2)).toThrow(HTTPError[400]);
    expect(() => adminQuestionCreateV2(sessionId, quizId, body3)).toThrow(HTTPError[400]);
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
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
      thumbnailUrl: 'http://testingV2QuestionUpdate.jpeg'
    };
    const questionUpdate = adminQuestionUpdateV2(sessionId, quiz, questionid, body1);
    expect(adminQuizInfoV2(sessionId, quiz).bodyObj as quizInfoV2Return).toStrictEqual({
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
        thumbnailUrl: 'http://testingV2QuestionUpdate.jpeg'
      }],
      duration: 4,
      thumbnailUrl: '',
    });
    expect(questionUpdate.bodyObj).toStrictEqual({ });
  });
  test('invalid QuizId', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quizId, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quizId + 1, questionid, body1)).toThrow(HTTPError[403]);
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const sessionId2 = (parseInt(decodeURIComponent(sessionId)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId2 + 1));
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const question = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(wrongtoken, quiz, question, body1)).toThrow(HTTPError[401]);
    // token passed in as a string
    expect(() => adminQuestionUpdateV2('happy', quiz, question, body)).toThrow(HTTPError[401]);
  });
  test('quizid doesnt match', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const token2 = (adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj as UserCreateReturn).token;
    const sessionId = decodeURIComponent(token1);
    const sessionId2 = decodeURIComponent(token2);
    const quiz1 = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const quiz2 = (adminQuizCreateV2(sessionId2, 'quiz2', 'second quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid1 = (adminQuestionCreateV2(sessionId, quiz1, body).bodyObj as QuestionCreateReturn).questionId;
    const questionid2 = (adminQuestionCreateV2(sessionId2, quiz2, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz2, questionid1, body1)).toThrow(HTTPError[403]);
    expect(() => adminQuestionUpdateV2(sessionId2, quiz1, questionid2, body1)).toThrow(HTTPError[403]);
  });
  test('short question length', () => {
    const sessionId = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;

    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };

    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('long question length', () => {
    const sessionId = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('too little answers', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const sessionId = decodeURIComponent(token1);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('too much answers', () => {
    const token1 = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const sessionId = decodeURIComponent(token1);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('invalid duration', () => {
    const sessionId = (adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn).token;
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body1)).toThrow(HTTPError[400]);
  });
  test('duration addition greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg',
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers2 = [answerObj3, answerObj4, answerObj1];
    const body2 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body2)).toThrow(HTTPError[400]);
  });
  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    // creating first question
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 140,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    // creating second question
    const answers2 = [answerObj2, answerObj1];
    const body2 : QuestionBodyV2 = {
      question: 'this is a test too',
      duration: 20,
      points: 5,
      answers: answers2,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid2 = (adminQuestionCreateV2(sessionId, quiz, body2).bodyObj as QuestionCreateReturn).questionId;
    // updating the questions
    const answers3 = [answerObj1, answerObj4];
    const body3 : QuestionBodyV2 = {
      question: 'this is a test three',
      duration: 50,
      points: 5,
      answers: answers3,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionUpdate = adminQuestionUpdateV2(sessionId, quiz, questionid, body1);
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid2, body3)).toThrow(HTTPError[400]);
    expect(questionUpdate.bodyObj).toStrictEqual({ });
  });
  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;

    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, shortAnswerObj];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, longAnswerObj];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('repeated answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj1, answerObj1];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const answers = [answerObj2, answerObj3, answerObj4];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid, body)).toThrow(HTTPError[400]);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = decodeURIComponent(token1.token);
    const quiz = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    const questionid = (adminQuestionCreateV2(sessionId, quiz, body1).bodyObj as QuestionCreateReturn).questionId;
    const ans = [answerObj1, answerObj3, answerObj4];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans,
      thumbnailUrl: 'https://invalidQuizId.jpg'
    };
    expect(() => adminQuestionUpdateV2(sessionId, quiz, questionid + 1, body)).toThrow(HTTPError[400]);
  });
  test('invalid URL', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const sessionId = token1.token;
    const quizId = (adminQuizCreateV2(sessionId, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.jpg',
    };
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3',
    };
    const body2 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: '1531Iteration3.jpeg',
    };
    const body3 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: '.jpeg1531https://Iteration3',
    };
    adminQuestionCreateV2(sessionId, quizId, body);
    // inserts an invalid number as the token
    expect(() => adminQuestionCreateV2(sessionId, quizId, body1)).toThrow(HTTPError[400]);
    expect(() => adminQuestionCreateV2(sessionId, quizId, body2)).toThrow(HTTPError[400]);
    expect(() => adminQuestionCreateV2(sessionId, quizId, body3)).toThrow(HTTPError[400]);
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
    const quizID = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    const body2 : QuestionBodyV2 = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    // creating two questions
    const questionid1 = adminQuestionCreateV2(token, quizID, body1).bodyObj as QuestionCreateReturn;
    const questionid2 = adminQuestionCreateV2(token, quizID, body2).bodyObj as QuestionCreateReturn;
    const id1 = questionid1.questionId;
    const id2 = questionid2.questionId;
    // removing one of the two questions and matching expected behavior
    adminQuestionRemoveV2(quizID, id1, token);
    expect(adminQuizInfoV2(token, quizID).bodyObj as quizInfoV2Return).toStrictEqual({
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
        thumbnailUrl: 'http://1531Iteration3.png'
      }],
      duration: 15,
      thumbnailUrl: ''
    });
    // if that succeeds, then removes the last remaining question and checking for empty question
    const obj = adminQuestionRemoveV2(quizID, id2, token);
    const info = adminQuizInfoV2(token, quizID).bodyObj as quizInfoV2Return;
    expect(info).toStrictEqual({
      quizId: quizID,
      name: 'quiz1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'first quiz',
      numQuestions: 0,
      questions: [],
      duration: 0,
      thumbnailUrl: ''
    });
    expect(obj.bodyObj).toStrictEqual({});
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.jpg'
    };
    const id1 = (adminQuestionCreateV2(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    // inputs invalid question id by doing (id + 1) to the only valid id
    expect(() => adminQuestionRemoveV2(quizId, id1 + 1, token)).toThrow(HTTPError[400]);
  });
  test('Token is empty or invalid (does not refer to valid logged in user session', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    // encodes a non-existent token by adding 1 to the only valid session id
    const sessionId = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));

    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.jpg'
    };
    const id1 = (adminQuestionCreateV2(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    expect(() => adminQuestionRemoveV2(quizId, id1, wrongtoken)).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuestionRemoveV2(quizId, id1, 'happy')).toThrow(HTTPError[401]);
  });
  test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quiz = adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.jpg'
    };
    const questionid1 = adminQuestionCreateV2(token, quiz.quizId, body1).bodyObj as QuestionCreateReturn;
    const id1 = questionid1.questionId;
    expect(() => adminQuestionRemoveV2(quiz.quizId, id1, token2.token)).toThrow(HTTPError[403]);
    expect(() => adminQuestionRemoveV2(quiz.quizId + 100, id1, token1.token)).toThrow(HTTPError[403]);
  });
  test('checking for END STATE', () => {
    const tokenObj = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = tokenObj.token;
    const quizID = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'http://1531Iteration3.png'
    };
    // creating two questions
    const questionid = (adminQuestionCreateV2(token, quizID, body1).bodyObj as QuestionCreateReturn).questionId;
    const quizSessionsId = (adminQuizSessionStart(token, quizID, 30).bodyObj as SessionCreateReturn).sessionId;
    adminQuizSessionStateUpdate(token, quizID, quizSessionsId, 'END');
    expect(() => adminQuestionRemoveV2(quizID, questionid, token)).toThrow(HTTPError[400]);
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
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const body2 : QuestionBodyV2 = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const body3 : QuestionBodyV2 = {
      question: 'this is yet another test',
      duration: 5,
      points: 10,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const body4 : QuestionBodyV2 = {
      question: 'as you can guess, this is yet another test',
      duration: 5,
      points: 10,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const questionid0 = (adminQuestionCreateV2(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    const questionid1 = (adminQuestionCreateV2(token, quizId, body2).bodyObj as QuestionCreateReturn).questionId;
    const questionid2 = (adminQuestionCreateV2(token, quizId, body3).bodyObj as QuestionCreateReturn).questionId;
    const questionid3 = (adminQuestionCreateV2(token, quizId, body4).bodyObj as QuestionCreateReturn).questionId;
    // moving a question and verifying the resultant question indexes to the expected behavior
    const res = adminQuestionMoveV2(quizId, questionid2, token, 0);
    expect(res.bodyObj).toStrictEqual({});
    let QuizInfo = adminQuizInfoV2(token, quizId).bodyObj as quizInfoV2Return;
    let questions = QuizInfo.questions;
    expect(questions[0].questionId).toStrictEqual(questionid2);
    expect(questions[1].questionId).toStrictEqual(questionid0);
    expect(questions[2].questionId).toStrictEqual(questionid1);
    expect(questions[3].questionId).toStrictEqual(questionid3);
    // performs another move and doing another verification
    const status = adminQuestionMoveV2(quizId, questionid3, token, 2);
    QuizInfo = adminQuizInfoV2(token, quizId).bodyObj as quizInfoV2Return;
    questions = QuizInfo.questions;
    expect(questions[2].questionId).toStrictEqual(questionid3);
    expect(status.bodyObj).toStrictEqual({});
  });
  test('Testing valid new position', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const body2 : QuestionBodyV2 = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const body3 : QuestionBodyV2 = {
      question: 'this is yet another test',
      duration: 5,
      points: 10,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const questionid0 = (adminQuestionCreateV2(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    const questionid1 = (adminQuestionCreateV2(token, quizId, body2).bodyObj as QuestionCreateReturn).questionId;
    const questionid2 = (adminQuestionCreateV2(token, quizId, body3).bodyObj as QuestionCreateReturn).questionId;
    // attempting to move it to outside the index
    expect(() => adminQuestionMoveV2(quizId, questionid1, token, 4)).toThrow(HTTPError[400]);
    // attempting to move it to a negative index
    expect(() => adminQuestionMoveV2(quizId, questionid0, token, -1)).toThrow(HTTPError[400]);
    /// move it to its original position
    expect(() => adminQuestionMoveV2(quizId, questionid2, token, 2)).toThrow(HTTPError[400]);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const id1 = (adminQuestionCreateV2(token, quizId, body1).bodyObj as QuestionCreateReturn).questionId;
    // inputs an invalid question id by adding 1 to the only valid question id
    expect(() => adminQuestionMoveV2(quizId, id1 + 1, token, 0)).toThrow(HTTPError[400]);
  });
  test('Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const sessionId = (parseInt(decodeURIComponent(token1.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));

    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const id1 = (adminQuestionCreateV2(token, quizId, body1) as QuestionCreateReturn).questionId;
    // passes in a wrong token by adding 1 to the only valid session id
    expect(() => adminQuestionMoveV2(quizId, id1, wrongtoken, 0)).toThrow(HTTPError[401]);
    // token is passed as a string instead of number
    expect(() => adminQuestionMoveV2(quizId, id1, 'happy', 0)).toThrow(HTTPError[401]);
  });
  test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj as UserCreateReturn;
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng').bodyObj as UserCreateReturn;
    const token = token1.token;
    const quizId = (adminQuizCreateV2(token, 'quiz1', 'first quiz').bodyObj as QuizCreateReturn).quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBodyV2 = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers,
      thumbnailUrl: 'https://beautifulImage.png'
    };
    const questionid1 = adminQuestionCreateV2(token, quizId, body1).bodyObj as QuestionCreateReturn;
    const id1 = questionid1.questionId;
    // inputting a valid quizId but not one corresponding to the given user's quizzes
    expect(() => adminQuestionMoveV2(quizId, id1, token2.token, 0)).toThrow(HTTPError[403]);
    // inputting an invalid quizId by making it negative
    expect(() => adminQuestionMoveV2(quizId * (-1), id1, token1.token, 0)).toThrow(HTTPError[403]);
  });
});

// =============================================================================
// =========================  adminQuestionDuplicate  ==========================
// =============================================================================
/*
describe('test question Duplicate', () => {
  beforeEach(() => {
    clear();
  });
  const answer1 = 'this is answer1';
  const answer2 = 'this is answer2';
  const answerObj1: answer = { answer: answer1, correct: true };
  const answerObj2: answer = { answer: answer2, correct: false };

  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const sessionId2 = (parseInt(decodeURIComponent(token1)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId2 + 1));
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const question = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    const duplicate = adminQuestionDuplicate(wrongtoken, quiz.bodyObj.quizId, question.bodyObj.questionId);
    expect(duplicate.bodyObj).toStrictEqual(ERROR);
    expect(duplicate.statusCode).toStrictEqual(UNAUTHORIZED);
    // token is passed as a string instead of number
    const question2 = adminQuestionDuplicate('happy', quiz.bodyObj.quizId, question.bodyObj.questionId);
    expect(question2.bodyObj).toStrictEqual(ERROR);
    expect(question2.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('quizid doesnt match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId1 = decodeURIComponent(token1.bodyObj.token);
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong');
    const sessionId2 = decodeURIComponent(token2.bodyObj.token);
    const quiz = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId2, quiz.bodyObj.quizId, body);
    const duplicate = adminQuestionDuplicate(sessionId2, quiz.bodyObj.quizId + 1, questionid.bodyObj.questionId);
    expect(duplicate.bodyObj).toStrictEqual(ERROR);
    expect(duplicate.statusCode).toStrictEqual(FORBIDDEN);
  });

  test('quizid doest match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId1 = decodeURIComponent(token1.bodyObj.token);
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong');
    const sessionId2 = decodeURIComponent(token2.bodyObj.token);
    const quiz = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    const quiz1 = adminQuizCreate(sessionId2, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId2, quiz.bodyObj.quizId, body);
    const duplicate = adminQuestionDuplicate(sessionId1, quiz1.bodyObj.quizId, questionid.bodyObj.questionId);
    expect(duplicate.bodyObj).toStrictEqual(ERROR);
    expect(duplicate.statusCode).toStrictEqual(FORBIDDEN);
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;
    const questionDuplicate = adminQuestionDuplicate(sessionId, quiz, questionid + 1);
    expect(questionDuplicate.bodyObj).toStrictEqual(ERROR);
    expect(questionDuplicate.statusCode).toStrictEqual(400);
  });

  test('success create', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const body1 : QuestionBody = {
      question: 'this is a test 2',
      duration: 15,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body).bodyObj.questionId;
    const questionid2 = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body1).bodyObj.questionId;
    const questionDuplicate = adminQuestionDuplicate(sessionId, quiz.bodyObj.quizId, questionid);
    const info = adminQuizInfo(sessionId, quiz.bodyObj.quizId);
    expect(info.bodyObj).toStrictEqual({
      quizId: quiz.bodyObj.quizId,
      name: 'quiz1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'first quiz',
      numQuestions: 3,
      questions: [{
        questionId: questionid,
        question: body.question,
        duration: body.duration,
        points: body.points,
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
        }]
      },
      {
        questionId: questionDuplicate.bodyObj.questionId,
        question: body.question,
        duration: body.duration,
        points: body.points,
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
        }]
      },
      {
        questionId: questionid2,
        question: body1.question,
        duration: body1.duration,
        points: body1.points,
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
        }]
      }],
      duration: 35
    });
    expect(questionDuplicate.bodyObj).toStrictEqual({ questionId: expect.any(Number) });
    expect(questionDuplicate.statusCode).toStrictEqual(OK);
  });
});
*/
