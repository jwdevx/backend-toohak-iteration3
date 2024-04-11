import HTTPError from 'http-errors';
import {
  UserCreateReturn, QuizCreateReturn, QuestionCreateReturn, SessionCreateReturn,
  PlayerJoinReturn, SessionStatusReturn, EmptyObject, playerQuestionPositionInfoReturn, quizInfoV2Return
} from './returnInterfaces';
import {
  clear, adminAuthRegister, adminQuizCreate, adminQuestionCreateV2, adminQuizSessionStart,
  playerJoin, playerQuestionPositionInfo, adminQuizSessionStateUpdate, adminQuizSessionGetStatus,
  playerQuestionAnswerSubmit, adminQuizInfoV2,
} from './apiRequestsIter3';
import { QuestionBodyV2 } from './dataStore';
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

// =============================================================================
// ===============          playerFinalResults           =======================
// =============================================================================

// TODO SADAT

// =============================================================================
// =================          playerReturnAllChat          =====================
// =============================================================================

// TODO ASH

// =============================================================================
// ==================          playerSendChat           ========================
// =============================================================================

// TODO ASH
