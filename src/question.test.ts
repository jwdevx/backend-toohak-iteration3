
import {
  adminAuthRegister, adminQuestionCreate, adminQuestionUpdate,
  adminQuizCreate, adminQuestionRemove,
  adminQuizInfo, adminQuestionMove, adminQuestionDuplicate, clear
} from './apiRequests';
import { QuestionBody, answer } from './dataStore';

const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const ERROR = { error: expect.any(String) };
// =============================================================================
// =========================    adminQuestionCreate   ==========================
// =============================================================================

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
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual({ questionId: expect.any(Number) });
    expect(questionid.statusCode).toStrictEqual(OK);
  });
  test('invalid token', () => {
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
    // inserts an invalid number as the token
    const question = adminQuestionCreate('999999', quiz.bodyObj.quizId, body);
    expect(question.bodyObj).toStrictEqual(ERROR);
    expect(question.statusCode).toStrictEqual(UNAUTHORIZED);
    // token is passed as a string instead of number
    const question2 = adminQuestionCreate('happy', quiz.bodyObj.quizId, body);
    expect(question2.bodyObj).toStrictEqual(ERROR);
    expect(question2.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('quizid is invalid', () => {
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
    const questionid = adminQuestionCreate(sessionId2, quiz.bodyObj.quizId + 1, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(FORBIDDEN);
  });
  test('quizid doest match', () => {
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
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(FORBIDDEN);
  });
  test('short question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('long question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('too little answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('too much answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('invalid duration', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body1);
    const answers2 = [answerObj3, answerObj4];
    const body2 : QuestionBody = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2
    };
    const questionid2 = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body2);
    expect(questionid2.bodyObj).toStrictEqual(ERROR);
    expect(questionid2.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, shortAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, longAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('repeate answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj1];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const answers = [answerObj2, answerObj3, answerObj4];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz.bodyObj.quizId, body);
    expect(questionid.bodyObj).toStrictEqual(ERROR);
    expect(questionid.statusCode).toStrictEqual(BAD_REQUEST);
  });
});

// =============================================================================
// =========================  adminQuestionUpdate  =============================
// =============================================================================

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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(token1, quiz, body).bodyObj.questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(adminQuizInfo(sessionId, quiz).bodyObj).toStrictEqual({
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
        }]
      }],
      duration: 4,
    });
    expect(questionUpdate.bodyObj).toStrictEqual({ });
    expect(questionUpdate.statusCode).toStrictEqual(OK);
  });
  test('invalid QuizId', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(token1, quiz, body).bodyObj.questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz + 1, questionid, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(FORBIDDEN);
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = (decodeURIComponent(token1));
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const sessionId2 = (parseInt(decodeURIComponent(token1)));

    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId2 + 1));
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const question = adminQuestionCreate(token1, quiz, body).bodyObj.questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(wrongtoken, quiz, question, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(UNAUTHORIZED);
    // token passed in as a string
    const question2 = adminQuestionUpdate('happy', quiz, question, body);
    expect(question2.bodyObj).toStrictEqual(ERROR);
    expect(question2.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('quizid doesnt match', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const sessionId2 = decodeURIComponent(token2);
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const quiz2 = adminQuizCreate(sessionId2, 'quiz2', 'second quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(sessionId, quiz1, body).bodyObj.questionId;
    const questionid2 = adminQuestionCreate(sessionId2, quiz2, body).bodyObj.questionId;
    const ans = [answerObj8, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test update',
      duration: 4,
      points: 6,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz2, questionid1, body1);
    adminQuestionUpdate(sessionId2, quiz1, questionid2, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(FORBIDDEN);
  });

  test('short question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);

    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body).bodyObj.questionId;

    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'sho',
      duration: 10,
      points: 5,
      answers: ans
    };

    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('long question length', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body).bodyObj.questionId;
    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      duration: 10,
      points: 5,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('too little answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body).bodyObj.questionId;
    const ans = [answerObj1];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('too much answers', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);

    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body).bodyObj.questionId;
    const ans = [answerObj1, answerObj2, answerObj3, answerObj4, answerObj5, answerObj6, answerObj7];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('invalid duration', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const sessionId = decodeURIComponent(token1);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body).bodyObj.questionId;
    const ans = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: -1,
      points: 5,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('duration addition greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;
    const answers2 = [answerObj3, answerObj4, answerObj1];
    const body2 : QuestionBody = {
      question: 'this is a test',
      duration: 190,
      points: 5,
      answers: answers2
    };
    const questionidUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body2);
    expect(questionidUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionidUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('duration sum greater than 180', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    // creating first question
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 140,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;
    // creating second question
    const answers2 = [answerObj2, answerObj1];
    const body2 : QuestionBody = {
      question: 'this is a test too',
      duration: 20,
      points: 5,
      answers: answers2
    };
    const questionid2 = adminQuestionCreate(sessionId, quiz, body2).bodyObj.questionId;
    // updating the questions
    const answers3 = [answerObj1, answerObj4];
    const body3 : QuestionBody = {
      question: 'this is a test three',
      duration: 50,
      points: 5,
      answers: answers3
    };

    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body1);
    const questionUpdate2 = adminQuestionUpdate(sessionId, quiz, questionid2, body3);
    expect(questionUpdate2.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate2.statusCode).toStrictEqual(400);

    expect(questionUpdate.bodyObj).toStrictEqual({ });
    expect(questionUpdate.statusCode).toStrictEqual(OK);
  });

  test('low points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;
    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: -1,
      answers: answers
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('high points', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;

    const answers = [answerObj1, answerObj2];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 50,
      answers: answers
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('short answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;

    const answers = [answerObj1, shortAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('long answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;

    const answers = [answerObj1, longAnswerObj];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test('repeated answer', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;
    const answers = [answerObj1, answerObj1];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
  });
  test('none correct', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = decodeURIComponent(token1.bodyObj.token);
    const quiz = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers1 = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers1
    };
    const questionid = adminQuestionCreate(sessionId, quiz, body1).bodyObj.questionId;
    const answers = [answerObj2, answerObj3, answerObj4];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(BAD_REQUEST);
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
    const ans = [answerObj1, answerObj3, answerObj4];
    const body : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: ans
    };
    const questionUpdate = adminQuestionUpdate(sessionId, quiz, questionid + 1, body);
    expect(questionUpdate.bodyObj).toStrictEqual(ERROR);
    expect(questionUpdate.statusCode).toStrictEqual(400);
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const body2 : QuestionBody = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers
    };
    // creating two questions
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const questionid2 = adminQuestionCreate(token, quiz.bodyObj.quizId, body2);
    const id1 = questionid1.bodyObj.questionId;
    const id2 = questionid2.bodyObj.questionId;
    // removing one of the two questions and matching expected behavior
    adminQuestionRemove(quiz.bodyObj.quizId, id1, token);
    expect(adminQuizInfo(token, quiz.bodyObj.quizId).bodyObj).toStrictEqual({
      quizId: quiz.bodyObj.quizId,
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
        }]
      }],
      duration: 15,
    });
    // if that succeeds, then removes the last remaining question and checking for empty question
    const obj = adminQuestionRemove(quiz.bodyObj.quizId, id2, token);
    const info = adminQuizInfo(token, quiz.bodyObj.quizId);
    expect(info.bodyObj).toStrictEqual({
      quizId: quiz.bodyObj.quizId,
      name: 'quiz1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'first quiz',
      numQuestions: 0,
      questions: [],
      duration: 0,
    });
    expect(info.statusCode).toStrictEqual(OK);
    expect(obj.bodyObj).toStrictEqual({});
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const id1 = questionid1.bodyObj.questionId;
    // inputs invalid question id by doing (id + 1) to the only valid id
    const obj = adminQuestionRemove(quiz.bodyObj.quizId, id1 + 1, token);
    expect(obj.bodyObj).toStrictEqual(ERROR);
    expect(obj.statusCode).toStrictEqual(400);
  });

  test('Token is empty or invalid (does not refer to valid logged in user session', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');
    // encodes a non-existent token by adding 1 to the only valid session id
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));

    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const id1 = questionid1.bodyObj.questionId;
    const obj = adminQuestionRemove(quiz.bodyObj.quizId, id1, wrongtoken);
    expect(obj.bodyObj).toStrictEqual(ERROR);
    expect(obj.statusCode).toStrictEqual(401);
    // token is passed as a string instead of number
    const question2 = adminQuestionRemove(quiz.bodyObj.quizId, id1, 'happy');
    expect(question2.bodyObj).toStrictEqual(ERROR);
    expect(question2.statusCode).toStrictEqual(UNAUTHORIZED);
  });

  test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const id1 = questionid1.bodyObj.questionId;
    const obj = adminQuestionRemove(quiz.bodyObj.quizId, id1, token2.bodyObj.token);
    expect(obj.bodyObj).toStrictEqual(ERROR);
    expect(obj.statusCode).toStrictEqual(403);

    const obj1 = adminQuestionRemove(quiz.bodyObj.quizId + 100, id1, token1.bodyObj.token);
    expect(obj1.bodyObj).toStrictEqual(ERROR);
    expect(obj1.statusCode).toStrictEqual(403);
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
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quizId = adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const body2 : QuestionBody = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers
    };
    const body3 : QuestionBody = {
      question: 'this is yet another test',
      duration: 5,
      points: 10,
      answers: answers
    };
    const body4 : QuestionBody = {
      question: 'as you can guess, this is yet another test',
      duration: 5,
      points: 10,
      answers: answers
    };
    const questionid0 = adminQuestionCreate(token, quizId, body1).bodyObj.questionId;
    const questionid1 = adminQuestionCreate(token, quizId, body2).bodyObj.questionId;
    const questionid2 = adminQuestionCreate(token, quizId, body3).bodyObj.questionId;
    const questionid3 = adminQuestionCreate(token, quizId, body4).bodyObj.questionId;
    // moving a question and verifying the resultant question indexes to the expected behavior
    const res = adminQuestionMove(quizId, questionid2, token, 0);
    expect(res.statusCode).toStrictEqual(OK);
    let QuizInfo = adminQuizInfo(token, quizId);
    expect(QuizInfo.statusCode).toStrictEqual(OK);
    let questions = QuizInfo.bodyObj.questions;
    expect(questions[0].questionId).toStrictEqual(questionid2);
    expect(questions[1].questionId).toStrictEqual(questionid0);
    expect(questions[2].questionId).toStrictEqual(questionid1);
    expect(questions[3].questionId).toStrictEqual(questionid3);
    // performs another move and doing another verification
    const status = adminQuestionMove(quizId, questionid3, token, 2);
    QuizInfo = adminQuizInfo(token, quizId);
    questions = QuizInfo.bodyObj.questions;
    expect(questions[2].questionId).toStrictEqual(questionid3);
    expect(status.statusCode).toStrictEqual(200);
    expect(status.bodyObj).toStrictEqual({});
  });
  test('Testing valid new position', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quizId = adminQuizCreate(token, 'quiz1', 'first quiz').bodyObj.quizId;
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const body2 : QuestionBody = {
      question: 'this is another test',
      duration: 15,
      points: 5,
      answers: answers
    };
    const body3 : QuestionBody = {
      question: 'this is yet another test',
      duration: 5,
      points: 10,
      answers: answers
    };
    const questionid0 = adminQuestionCreate(token, quizId, body1).bodyObj.questionId;
    const questionid1 = adminQuestionCreate(token, quizId, body2).bodyObj.questionId;
    const questionid2 = adminQuestionCreate(token, quizId, body3).bodyObj.questionId;
    // attempting to move it to outside the index
    let res = adminQuestionMove(quizId, questionid1, token, 4);
    expect(res.bodyObj).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
    // attempting to move it to a negative index
    res = adminQuestionMove(quizId, questionid0, token, -1);
    expect(res.bodyObj).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
    // attempt to move it to its original position
    res = adminQuestionMove(quizId, questionid2, token, 2);
    expect(res.bodyObj).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const id1 = questionid1.bodyObj.questionId;
    // inputs an invalid question id by adding 1 to the only valid question id
    const obj = adminQuestionMove(quiz.bodyObj.quizId, id1 + 1, token, 0);
    expect(obj.bodyObj).toStrictEqual(ERROR);
    expect(obj.statusCode).toStrictEqual(400);
  });
  test('Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');

    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));

    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const id1 = questionid1.bodyObj.questionId;
    // passes in a wrong token by adding 1 to the only valid session id
    const obj = adminQuestionMove(quiz.bodyObj.quizId, id1, wrongtoken, 0);
    expect(obj.bodyObj).toStrictEqual(ERROR);
    expect(obj.statusCode).toStrictEqual(401);
    // token is passed as a string instead of number
    const question2 = adminQuestionMove(quiz.bodyObj.quizId, id1, 'happy', 0);
    expect(question2.bodyObj).toStrictEqual(ERROR);
    expect(question2.statusCode).toStrictEqual(UNAUTHORIZED);
  });
  test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
    const token = token1.bodyObj.token;
    const quiz = adminQuizCreate(token, 'quiz1', 'first quiz');
    const answers = [answerObj1, answerObj2];
    const body1 : QuestionBody = {
      question: 'this is a test',
      duration: 10,
      points: 5,
      answers: answers
    };
    const questionid1 = adminQuestionCreate(token, quiz.bodyObj.quizId, body1);
    const id1 = questionid1.bodyObj.questionId;
    // inputting a valid quizId but not one corresponding to the given user's quizzes
    const obj = adminQuestionMove(quiz.bodyObj.quizId, id1, token2.bodyObj.token, 0);
    expect(obj.bodyObj).toStrictEqual(ERROR);
    expect(obj.statusCode).toStrictEqual(403);
    // inputting an invalid quizId by making it negative
    const obj1 = adminQuestionMove(quiz.bodyObj.quizId * (-1), id1, token1.bodyObj.token, 0);
    expect(obj1.bodyObj).toStrictEqual(ERROR);
    expect(obj1.statusCode).toStrictEqual(403);
  });
});

// =============================================================================
// =========================  adminQuestionDuplicate  ==========================
// =============================================================================

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
