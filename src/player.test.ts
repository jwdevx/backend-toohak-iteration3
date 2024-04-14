import HTTPError from 'http-errors';
import {
  UserCreateReturn, QuizCreateReturn, QuestionCreateReturn, SessionCreateReturn,
  PlayerJoinReturn, SessionStatusReturn, EmptyObject, playerQuestionPositionInfoReturn, quizInfoV2Return,
  finalResults
} from './returnInterfaces';
import {
  clear, adminAuthRegister, adminQuizCreate, adminQuestionCreateV2, adminQuizSessionStart,
  playerJoin, playerQuestionPositionInfo, adminQuizSessionStateUpdate, adminQuizSessionGetStatus,
  playerQuestionAnswerSubmit, adminQuizInfoV2, playerQuestionResults, playerFinalResults
} from './apiRequestsIter3';
import { QuestionBodyV2, questionResults } from './dataStore';
import { delay } from './helper';
beforeEach(() => { clear(); });

// =============================================================================
// ====================          playerJoin           ==========================
// =============================================================================

// TODO VENUS

// =============================================================================
// ====================        playerStatus           ==========================
// =============================================================================

// TODO VENUS

// =============================================================================
// ===============        playerQuestionPositionInfo          ==================
// =============================================================================

describe('Complete Test for playerQuestionPositionInfo', () => {
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody2: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 4,
    points: 5,
    answers: [
      { answer: 'Blue', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'Blue, white and green', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };

  beforeEach(() => {
    clear();
  });
  // Error 400 if player ID does not exist
  test('player ID does not existV1', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));
    expect(() => playerQuestionPositionInfo(null, 1)).toThrow(HTTPError[400]);
  });

  test('player ID does not existV2', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));
    expect(() => playerQuestionPositionInfo(playerId1 + 1, 1)).toThrow(HTTPError[400]);
  });

  // Error 400 if question position is not valid for the session this player is in
  test('question position is not valid for the session this player is in', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));
    expect(() => playerQuestionPositionInfo(playerId1, -1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionPositionInfo(playerId1, 0)).toThrow(HTTPError[400]);
    expect(() => playerQuestionPositionInfo(playerId1, 5)).toThrow(HTTPError[400]);
  });

  // Error 400 if session is not currently on this question
  test('session is not currently on this question', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));
    expect(() => playerQuestionPositionInfo(playerId1, 2)).toThrow(HTTPError[400]);
  });

  // Error 400 if session is in LOBBY, QUESTION_COUNTDOWN, or END state
  test('Session is in LOBBY, QUESTION_COUNTDOWN, or END state', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));

    // Lobby
    expect(() => playerQuestionPositionInfo(playerId1, 1)).toThrow(HTTPError[400]);
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    // Question_countdown
    // TODO autonum question countdown is yet to be implemented <----------------------------------------------------
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    expect(() => playerQuestionPositionInfo(playerId1, 1)).toThrow(HTTPError[400]);

    // End
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'END');
    expect(() => playerQuestionPositionInfo(playerId1, 1)).toThrow(HTTPError[400]);
  });

  // 3.Success 200
  test('Success 200', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));

    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    // Question_countdown
    // TODO autonum question countdown is yet to be implemented <----------------------------------------------------
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // const status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // console.log(status);
    const statusUpdate1 = adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN').bodyObj as EmptyObject;
    expect(statusUpdate1).toStrictEqual({});
    const qpInfo1 = playerQuestionPositionInfo(playerId1, 1).bodyObj as playerQuestionPositionInfoReturn;
    expect(qpInfo1).toStrictEqual({
      questionId: expect.any(Number),
      question: expect.any(String),
      duration: expect.any(Number),
      thumbnailUrl: expect.any(String),
      points: expect.any(Number),
      answers: expect.any(Array),
    });
    // console.log(qpInfo1);
  });
});

// =============================================================================
// ================         playerQuestionAnswerSubmit      ====================
// =============================================================================

describe('Complete Test for playerQuestionAnswerSubmit', () => {
  const invalidAnswerIds = [-99999999];
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody2: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 4,
    points: 5,
    answers: [
      { answer: 'Blue', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'Blue, white and green', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };

  beforeEach(() => {
    clear();
  });

  // Allow the current player to submit answer(s) to the currently active question. Question position starts at 1
  // Note: An answer can be re-submitted once first selection is made, as long as game is in the right state

  // Error 400 if player ID does not exist
  test('400 if player ID does not exist', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // console.log(allAnswersQuestion1);
    // console.log(correctAnswersQuestion1);

    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    // console.log(allAnswersQuestion2);
    // console.log(correctAnswersQuestion2);

    // Start a quiz session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    // This should hit the first error instead of invalid AnswerIds
    expect(() => playerQuestionAnswerSubmit(null, 1, correctAnswersQuestion1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1 + 1, 1, correctAnswersQuestion1)).toThrow(HTTPError[400]);
  });

  // Error 400 if question position is not valid for the session this player is in
  test('400 if question position is not valid for the session this player is in', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    // This should hit the second error instead of invalid AnswerIds
    expect(() => playerQuestionAnswerSubmit(playerId1, -1, invalidAnswerIds)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 0, invalidAnswerIds)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 10, invalidAnswerIds)).toThrow(HTTPError[400]);
  });

  // Error 400 if session is not in QUESTION_OPEN state
  test('400 if session is not in QUESTION_OPEN state', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    // const status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // console.log(status);

    // This should hit error is not in QUESTION_OPEN state as it is now in lobby
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1)).toThrow(HTTPError[400]);
  });

  // Error 400 if  session is not yet up to this question
  test('400 if session is not yet up to this question', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // let status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // console.log(status);
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1)).not.toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 2, correctAnswersQuestion1)).toThrow(HTTPError[400]);

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // console.log(status);
    expect(() => playerQuestionAnswerSubmit(playerId1, 3, correctAnswersQuestion1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 2, correctAnswersQuestion1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 2, correctAnswersQuestion2)).not.toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId2, 2, correctAnswersQuestion2)).not.toThrow(HTTPError[400]);
  });

  // Error 400 if answer IDs are not valid for this particular question
  test('400 if answer IDs are not valid for this particular question', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, invalidAnswerIds)).toThrow(HTTPError[400]);
  });

  // Error 400 if there are duplicate answer IDs provided
  test('400 if there are duplicate answer IDs provided', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    const duplicatecorrectAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) {
        duplicatecorrectAnswersQuestion1.push(a.answerId);
        duplicatecorrectAnswersQuestion1.push(a.answerId); // Push the same answerId again to create a duplicate
      }
    }
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, duplicatecorrectAnswersQuestion1)).toThrow(HTTPError[400]);
  });

  // Error 400 if less than 1 answer ID was submitted
  test('400 if less than 1 answer ID was submitted', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    const zeroAnswersQuestion1: Array<number> = [];
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, zeroAnswersQuestion1)).toThrow(HTTPError[400]);
  });

  // 3.Success 200
  test('Success 200', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    const wrongAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === false) { wrongAnswersQuestion1.push(a.answerId); }
    }

    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // let status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // console.log(status);

    //! Wrong Answer
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion2)).toThrow(HTTPError[400]);

    const submitAns1 = playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    expect(submitAns1.bodyObj).toStrictEqual({});

    // Resubmit answer1 but its wrong one now
    // test('Allow the current player to submit answer(s) to the currently active question.', () => {  });
    const resubmitAns1 = playerQuestionAnswerSubmit(playerId1, 1, wrongAnswersQuestion1);
    expect(resubmitAns1.bodyObj).toStrictEqual({});

    expect(() => playerQuestionAnswerSubmit(playerId1, 2, correctAnswersQuestion1)).toThrow(HTTPError[400]);
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    // console.log(status);

    //! Wrong answer
    expect(() => playerQuestionAnswerSubmit(playerId1, 2, correctAnswersQuestion1)).toThrow(HTTPError[400]);

    const submitAns2 = playerQuestionAnswerSubmit(playerId1, 2, correctAnswersQuestion2);
    expect(submitAns2.bodyObj).toStrictEqual({});
  });

  // TODO maybe from Sadat's function this will already be tested
  // test('Check score is caculated correctly', () => {  });
});

// =============================================================================
// ================          playerQuestionResults          ====================
// =============================================================================

// TODO SADAT
describe('Complete Test for playerQuestionResults', () => {
  const invalidAnswerIds = [-99999999];
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 10,
    points: 6,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody2: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 5,
    points: 5,
    answers: [
      { answer: 'Blue', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'Blue, white and green', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody3: QuestionBodyV2 = {
    question: 'What colour is the moon?',
    duration: 1,
    points: 5,
    answers: [
      { answer: 'white', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'black and white', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  beforeEach(() => {
    clear();
  });
  test('correct functionality', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    // making an array with all answers' id
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    // making an array with all correct answers' id
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // making an array with all wrong answers' id
    const wrongAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === false) { wrongAnswersQuestion1.push(a.answerId); }
    }
    // creating Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    const wrongAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === false) { wrongAnswersQuestion2.push(a.answerId); }
    }
    // creating Question 3
    const questionId3 = (adminQuestionCreateV2(token1, quizId1, questionBody3).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion3 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[2].answers;
    const allAnswersQuestion3: Array<number> = []; for (const a of answerObjectQuestion3) { allAnswersQuestion3.push(a.answerId); }
    const correctAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === true) { correctAnswersQuestion3.push(a.answerId); }
    }
    const wrongAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === false) { wrongAnswersQuestion3.push(a.answerId); }
    }
    // starting session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'julius').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'caesar').bodyObj as PlayerJoinReturn).playerId;
    const playerId3 = (playerJoin(quizSessionId1, 'alexander').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submitting correct answers for question 1 and takes total 2 seconds
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    // caesar is submitting wrong answers for question 1 and takes total 3 seconds
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 1, wrongAnswersQuestion1);
    // alexander is submitting correct answers for question 1 and takes total 4 seconds
    delay(1000);
    playerQuestionAnswerSubmit(playerId3, 1, correctAnswersQuestion1);
    // now let's end the question and process answer
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3 + 4) / 3 = 3.
    // expected percent correct = 2/3 * 100 which rounds to 67
    expect(playerQuestionResults(playerId1, 1).bodyObj as questionResults).toStrictEqual({
      questionId: questionId1,
      playersCorrectList: ['julius', 'alexander'],
      averageAnswerTime: 3,
      percentCorrect: 67
    });
    expect(playerQuestionResults(playerId2, 1).bodyObj as questionResults).toStrictEqual({
      questionId: questionId1,
      playersCorrectList: ['julius', 'alexander'],
      averageAnswerTime: 3,
      percentCorrect: 67
    });
    // let's move to second question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submitting wrong answers for question 2 and takes total 2 seconds
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 2, wrongAnswersQuestion2);
    // caesar is submitting correct answers for question 2 and takes total 3 seconds
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 2, correctAnswersQuestion2);
    // alexander is submitting correct answers for question 2 but takes total 6 secs which exceeds the duration of 5 secs.
    // his answer should not be registered and should be marked as incorrect
    delay(3000);
    expect(() => playerQuestionAnswerSubmit(playerId3, 2, correctAnswersQuestion2)).toThrow(HTTPError[400]);
    // we should have moved to QUESTION_CLOSE automatically by now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3) / 2 = 2.5 which rounds to 3
    // expected percent correct = (1 / 3 * 100) which rounds to 33
    expect(playerQuestionResults(playerId1, 2).bodyObj as questionResults).toStrictEqual({
      questionId: questionId2,
      playersCorrectList: ['caesar'],
      averageAnswerTime: 3,
      percentCorrect: 33
    });
    // let's move to third question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius, caesar and alexander couldnt submit within question duration of 1 sec
    delay(1000);
    expect(() => playerQuestionAnswerSubmit(playerId1, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId2, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId3, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    // goes to answer show with everyone getting 0
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    expect(playerQuestionResults(playerId1, 3).bodyObj as questionResults).toStrictEqual({
      questionId: questionId3,
      playersCorrectList: [],
      averageAnswerTime: 0,
      percentCorrect: 0
    });
  });
  test('400 if player does not exist', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quizId1, questionBody1);
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    // Start a quiz session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // players submit the answers
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId2, 1, correctAnswersQuestion1);
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    expect(() => playerQuestionResults(null, 1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionResults(playerId1 + 1, 1)).toThrow(HTTPError[400]);
  });
  test('400 if question position is not valid for the session this player is in', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');

    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId2, 1, correctAnswersQuestion1);
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');

    expect(() => playerQuestionAnswerSubmit(playerId1, -1, invalidAnswerIds)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 0, invalidAnswerIds)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId1, 10, invalidAnswerIds)).toThrow(HTTPError[400]);
  });

  test('400 if state of the session is not in ANSWER_SHOW', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');

    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId2, 1, correctAnswersQuestion1);

    expect(() => playerQuestionResults(playerId1, 1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionResults(playerId1, 1)).toThrow(HTTPError[400]);
    expect(() => playerQuestionResults(playerId1, 1)).toThrow(HTTPError[400]);
  });
  test('400 if session is not yet up to this question', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    expect(quizId1).toStrictEqual(expect.any(Number));
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }

    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');

    expect(() => playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1)).not.toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId2, 1, correctAnswersQuestion1)).not.toThrow(HTTPError[400]);

    expect(() => playerQuestionResults(playerId1, 3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionResults(playerId1, 2)).toThrow(HTTPError[400]);
  });
});

// =============================================================================
// ===============          playerFinalResults           =======================
// =============================================================================

// TODO SADAT
describe('Complete Test for playerFinalResults', () => {
  const questionBody1: QuestionBodyV2 = {
    question: 'Who is the Monarch of England?',
    duration: 10,
    points: 6,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Princess Diana', correct: false }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody2: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 5,
    points: 2,
    answers: [
      { answer: 'Blue', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'Blue, white and green', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  const questionBody3: QuestionBodyV2 = {
    question: 'What colour is the moon?',
    duration: 1,
    points: 5,
    answers: [
      { answer: 'white', correct: true },
      { answer: 'Blue and Green', correct: false },
      { answer: 'Blue and White', correct: false },
      { answer: 'black and white', correct: true }],
    thumbnailUrl: 'http://google.com/some/image/path.jpg'
  };
  beforeEach(() => {
    clear();
  });
  test('correct functionality', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    // Extracting answer Question 1
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    // making an array with all answers' id
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    // making an array with all correct answers' id
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // making an array with all wrong answers' id
    const wrongAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === false) { wrongAnswersQuestion1.push(a.answerId); }
    }
    // creating Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    const wrongAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === false) { wrongAnswersQuestion2.push(a.answerId); }
    }
    // creating Question 3
    const questionId3 = (adminQuestionCreateV2(token1, quizId1, questionBody3).bodyObj as QuestionCreateReturn).questionId;
    // Extracting answer Question 2
    const answerObjectQuestion3 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[2].answers;
    const allAnswersQuestion3: Array<number> = []; for (const a of answerObjectQuestion3) { allAnswersQuestion3.push(a.answerId); }
    const correctAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === true) { correctAnswersQuestion3.push(a.answerId); }
    }
    const wrongAnswersQuestion3: Array<number> = [];
    for (const a of answerObjectQuestion3) {
      if (a.correct === false) { wrongAnswersQuestion3.push(a.answerId); }
    }
    // starting session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'julius').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'caesar').bodyObj as PlayerJoinReturn).playerId;
    const playerId3 = (playerJoin(quizSessionId1, 'alexander').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submits correct answers for question 1 twice and takes total 2 seconds
    // julius' score should for q1 should be 6 since he is first at getting it right. 6/1 = 6
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    // caesar is submitting wrong answers for question 1 and takes total 3 seconds
    // caesar's score for q1 is 0.
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 1, wrongAnswersQuestion1);
    // alexander is submitting correct answers for question 1 and takes total 4 seconds
    // alexanders's score for q1 should be 6/2 = 3 since he is second
    delay(1000);
    playerQuestionAnswerSubmit(playerId3, 1, correctAnswersQuestion1);
    // now let's end the question and process answer
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3 + 4) / 3 = 3.
    // expected percent correct = 2/3 * 100 which rounds to 67
    expect(playerQuestionResults(playerId1, 1).bodyObj as questionResults).toStrictEqual({
      questionId: questionId1,
      playersCorrectList: ['julius', 'alexander'],
      averageAnswerTime: 3,
      percentCorrect: 67
    });
    expect(playerQuestionResults(playerId2, 1).bodyObj as questionResults).toStrictEqual({
      questionId: questionId1,
      playersCorrectList: ['julius', 'alexander'],
      averageAnswerTime: 3,
      percentCorrect: 67
    });
    // let's move to second question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius is submitting wrong answers for question 2 and takes total 2 seconds
    // his score is 0.
    delay(2000);
    playerQuestionAnswerSubmit(playerId1, 2, wrongAnswersQuestion2);
    // caesar is submitting correct answers for question 2 and takes total 3 seconds
    // his score should be 2/1 = 2.
    delay(1000);
    playerQuestionAnswerSubmit(playerId2, 2, correctAnswersQuestion2);
    // alexander is submitting correct answers for question 2 but takes total 6 secs which exceeds the duration of 5 secs.
    // his answer should not be registered and should be marked as incorrect, scoring him 0.
    delay(3000);
    expect(() => playerQuestionAnswerSubmit(playerId3, 2, correctAnswersQuestion2)).toThrow(HTTPError[400]);
    // we should have moved to QUESTION_CLOSE automatically by now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    // expected average time = (2 + 3) / 2 = 2.5 which rounds to 3
    // expected percent correct = (1 / 3 * 100) which rounds to 33
    expect(playerQuestionResults(playerId1, 2).bodyObj as questionResults).toStrictEqual({
      questionId: questionId2,
      playersCorrectList: ['caesar'],
      averageAnswerTime: 3,
      percentCorrect: 33
    });
    // let's move to third question now
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // julius, caesar and alexander couldnt submit within question duration of 1 sec
    // they all get zero
    delay(1000);
    expect(() => playerQuestionAnswerSubmit(playerId1, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId2, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    expect(() => playerQuestionAnswerSubmit(playerId3, 3, correctAnswersQuestion3)).toThrow(HTTPError[400]);
    // goes to answer show with everyone getting 0
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    expect(playerQuestionResults(playerId1, 3).bodyObj as questionResults).toStrictEqual({
      questionId: questionId3,
      playersCorrectList: [],
      averageAnswerTime: 0,
      percentCorrect: 0
    });
    // now let's see the final results
    // julius' total score: 6 + 0 + 0 = 6
    // caesar's total score: 0 + 2 + 0 = 2
    // alexander's total score: 3 + 0 + 0 = 3
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_FINAL_RESULTS');
    expect(playerFinalResults(playerId1).bodyObj as finalResults).toStrictEqual({
      usersRankedByScore: [{ name: 'julius', score: 6 }, { name: 'alexander', score: 3 }, { name: 'caesar', score: 2 }],
      questionResults: [{
        questionId: questionId1,
        playersCorrectList: ['julius', 'alexander'],
        averageAnswerTime: 3,
        percentCorrect: 67
      }, {
        questionId: questionId2,
        playersCorrectList: ['caesar'],
        averageAnswerTime: 3,
        percentCorrect: 33
      }, {
        questionId: questionId3,
        playersCorrectList: [],
        averageAnswerTime: 0,
        percentCorrect: 0
      }]
    });
  });
  test('400 if player does not exist', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    adminQuestionCreateV2(token1, quizId1, questionBody1);
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    // Extracting answer Question 2
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion2 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[1].answers;
    const allAnswersQuestion2: Array<number> = []; for (const a of answerObjectQuestion2) { allAnswersQuestion2.push(a.answerId); }
    const correctAnswersQuestion2: Array<number> = [];
    for (const a of answerObjectQuestion2) {
      if (a.correct === true) { correctAnswersQuestion2.push(a.answerId); }
    }
    // Start a quiz session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');
    // players submit the answers
    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId2, 1, correctAnswersQuestion1);
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_FINAL_RESULTS');
    expect(() => playerFinalResults(null)).toThrow(HTTPError[400]);
    expect(() => playerFinalResults(playerId1 + 1)).toThrow(HTTPError[400]);
    expect(() => playerFinalResults(playerId2 - 1)).toThrow(HTTPError[400]);
  });

  test('400 if state of the session is not in FINAL_RESULTS', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const quizId1 = (adminQuizCreate(token1, 'quiz1name', 'quiz1description').bodyObj as QuizCreateReturn).quizId;
    const questionId1 = (adminQuestionCreateV2(token1, quizId1, questionBody1).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId1).toStrictEqual(expect.any(Number));
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
    const answerObjectQuestion1 = (adminQuizInfoV2(token1, quizId1).bodyObj as quizInfoV2Return).questions[0].answers;
    const allAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      allAnswersQuestion1.push(a.answerId);
    }
    const correctAnswersQuestion1: Array<number> = [];
    for (const a of answerObjectQuestion1) {
      if (a.correct === true) { correctAnswersQuestion1.push(a.answerId); }
    }
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 2).bodyObj as SessionCreateReturn).sessionId;
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');

    playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1);
    playerQuestionAnswerSubmit(playerId2, 1, correctAnswersQuestion1);
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');
    expect(() => playerFinalResults(playerId1)).toThrow(HTTPError[400]);
    expect(() => playerFinalResults(playerId1)).toThrow(HTTPError[400]);
    expect(() => playerFinalResults(playerId1)).toThrow(HTTPError[400]);
  });
});

// =============================================================================
// =================          playerReturnAllChat          =====================
// =============================================================================

// TODO ASH

// =============================================================================
// ==================          playerSendChat           ========================
// =============================================================================

// TODO ASH
