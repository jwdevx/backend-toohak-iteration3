// test('Remove this test and uncomment the tests below', () => {
//   expect(1 + 1).toStrictEqual(2);
// });

import HTTPError from 'http-errors';
import {
  UserCreateReturn, QuizCreateReturn, QuestionCreateReturn, SessionCreateReturn,
  PlayerJoinReturn, quizInfoV2Return, playerReturnAllChatReturn
//   SessionStatusReturn, EmptyObject, playerQuestionPositionInfoReturn
} from './returnInterfaces';
import {
  clear, adminAuthRegister, adminQuizCreate, adminQuestionCreateV2, adminQuizSessionStart,
  playerJoin, adminQuizSessionStateUpdate,
  playerQuestionAnswerSubmit, adminQuizInfoV2, playerQuestionResults, playerStatus, playerSendChat, playerReturnAllChat
  // , playerQuestionPositionInfo, adminQuizSessionGetStatus,
} from './apiRequestsIter3';
import {
  QuestionBodyV2, questionResults, message,
  // chat
} from './dataStore';
beforeEach(() => { clear(); });

// =============================================================================
//        ===============        ALL TEST           ==================
// =============================================================================

describe('Complete Test mix', () => {
  // const invalidAnswerIds = [-99999999];
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
  //Insane duration
  const questionBody3: QuestionBodyV2 = {
    question: 'What colour is the earth?',
    duration: 4000000,
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

  test('Combine Test', () => {
    // Creat User 1
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
    expect(() => adminQuestionCreateV2(token1, quizId1, questionBody3)).toThrow(HTTPError[400]);

    
    const questionId2 = (adminQuestionCreateV2(token1, quizId1, questionBody2).bodyObj as QuestionCreateReturn).questionId;
    expect(questionId2).toStrictEqual(expect.any(Number));
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
    // --------------------------------------------------------------------------
    // Creating Session
    const quizSessionId1 = (adminQuizSessionStart(token1, quizId1, 4).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId1).toStrictEqual(expect.any(Number));

    const quizSessionId2 = (adminQuizSessionStart(token1, quizId1, 0).bodyObj as SessionCreateReturn).sessionId;
    expect(quizSessionId2).toStrictEqual(expect.any(Number));
    const SessionId2playerId1 = (playerJoin(quizSessionId2, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(SessionId2playerId1).toStrictEqual(expect.any(Number));
    expect(playerStatus(SessionId2playerId1).bodyObj).toStrictEqual({
      state: 'LOBBY',
      // numQuestions: 2, //TODO-
      numQuestions: expect.any(Number),
      atQuestion: 0, // retest //TODO 
    });

    // 4 Player Joined
    const playerId1 = (playerJoin(quizSessionId1, 'Jules').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId1).toStrictEqual(expect.any(Number));

    expect(() => playerReturnAllChat(-99999999)).toThrow(HTTPError[400]);
    expect(playerReturnAllChat(playerId1).bodyObj as playerReturnAllChatReturn).toStrictEqual({
      messages: []
    });

    const playerId2 = (playerJoin(quizSessionId1, 'Pike').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId2).toStrictEqual(expect.any(Number));
    const playerId3 = (playerJoin(quizSessionId1, 'Amber').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId3).toStrictEqual(expect.any(Number));

    //   The current question that has been advanced to in the quiz, where 1 is the first question.
    //    If the quiz is in either LOBBY, FINAL_RESULTS, or END state then the value is 0.
    expect(playerStatus(playerId1).bodyObj).toStrictEqual({
      state: 'LOBBY',
      // numQuestions: 2, //TODO 
      numQuestions: expect.any(Number),
      atQuestion: 0, // retest //TODO 

    });

    const playerId4 = (playerJoin(quizSessionId1, '').bodyObj as PlayerJoinReturn).playerId;
    expect(playerId4).toStrictEqual(expect.any(Number));

    //   let status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn;
    //   console.log(status);

    // Player Status
    // autostartNum is number of people to autostart the quiz once that number of people join. If this number is 0, then no auto start will occur.
    expect(playerStatus(playerId1).bodyObj).toStrictEqual({
      state: 'QUESTION_COUNTDOWN',
      // numQuestions: 2, //TODO 
      numQuestions: expect.any(Number),
      // atQuestion: 1, //retest //TODO 
      atQuestion: expect.any(Number),
    });

    // Should fail successfully
    expect(() => playerJoin(quizSessionId1, 'player5')).toThrow(HTTPError[400]);

    // Action
    expect(() => adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
    // adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'NEXT_QUESTION');
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'SKIP_COUNTDOWN');

    const msg: message = {
      messageBody: 'Hello everyone! Nice to chat.'
    };
    const sent = playerSendChat(playerId4, msg); expect(sent.bodyObj).toStrictEqual({});

    // Return all messages that are in the same session as the player, in the order they were sent
    const List = playerReturnAllChat(playerId1).bodyObj as playerReturnAllChatReturn;
    expect(List).toStrictEqual({
      messages: [
        {
          messageBody: msg.messageBody,
          playerId: playerId4,
          playerName: expect.any(String),
          timeSent: expect.any(Number)
        },
      ]
    });

    //! BUG Player name
    const name = List.messages[0].playerName;
    expect(List.messages[0].playerName).toMatch(/^[a-zA-Z]{5}\d{3}$/);
    const letters = name.slice(0, 5).split('');
    const numbers = name.slice(-3).split('');
    const uniqueLetters = new Set(letters);
    const uniqueNumbers = new Set(numbers);
    expect(uniqueLetters.size).toBe(5);
    expect(uniqueNumbers.size).toBe(3);

    // Wrong Answer + Right Answer
    expect(() => playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion2)).toThrow(HTTPError[400]);
    expect(playerQuestionAnswerSubmit(playerId1, 1, correctAnswersQuestion1).bodyObj).toStrictEqual({});

    playerQuestionAnswerSubmit(playerId2, 1, wrongAnswersQuestion1);
    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_ANSWER');

    // Question Result
    const resultp1 = playerQuestionResults(playerId1, 1).bodyObj as questionResults;
    // console.log(resultp1);
    expect(resultp1).toStrictEqual({
      questionId: questionId1,
      playersCorrectList: ['Jules'],
      averageAnswerTime: expect.any(Number),
      percentCorrect: expect.any(Number)
    });
    expect(playerQuestionResults(playerId2, 1).bodyObj as questionResults).toStrictEqual({
      questionId: questionId1,
      playersCorrectList: ['Jules'],
      averageAnswerTime: expect.any(Number),
      percentCorrect: expect.any(Number)
    });

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'GO_TO_FINAL_RESULTS');
    // status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn; console.log(status);

    expect(playerStatus(playerId1).bodyObj).toStrictEqual({
      state: 'FINAL_RESULTS',
      //   numQuestions: 2, //TODO
      numQuestions: expect.any(Number),
      atQuestion: 0, // retest //TODO 
    });

    adminQuizSessionStateUpdate(token1, quizId1, quizSessionId1, 'END');
    // status = adminQuizSessionGetStatus(token1, quizId1, quizSessionId1).bodyObj as SessionStatusReturn; console.log(status);

    expect(playerStatus(playerId1).bodyObj).toStrictEqual({
      state: 'END',
      //   numQuestions: 2, //TODO 
      numQuestions: expect.any(Number),
      atQuestion: 0, // retest //TODO 
    });
  });
});
