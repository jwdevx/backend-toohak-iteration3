test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});

import {
  clear,
  // adminQuizCreate,
  // adminAuthRegister,
  // adminQuestionCreate,
  // adminQuizRemove,
} from './apiRequestsIter3';
import {
  // adminQuizThumbnailUpdate,
  // adminQuizViewSessions,
  // adminQuizSessionStart,
  // adminQuizSessionStateUpdate,
  // adminQuizSessionGetStatus,
  // adminQuizSessionGetResults,
  // adminQuizSessionGetResultsCSV,
} from './apiRequestsIter3';
import {
  // playerJoin,
  // playerStatus,
  // playerQuestionPositionInfo,
  // playerQuestionAnswerSubmit,
  // playerQuestionResults,
  // playerFinalResults,
  // playerReturnAllChat,
  // playerSendChat
} from './apiRequestsIter3';

const ERROR = { error: expect.any(String) };
beforeEach(() => {
  clear();
});

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

// TODO proper test, awaiting Venus to finish her function before i can properly test

describe('Complete Test for playerQuestionPositionInfo', () => {

  beforeEach(() => {
    clear();
  });
  // 1.Error 400
  test('player ID does not exist', () => {
    // const qpInfoPlayer1 = playerQuestionPositionInfo('', 1);
    // expect(qpInfoPlayer1.statusCode).toStrictEqual(400);
  });

  test('question position is not valid for the session this player is in', () => {
    // //Register User
    // const sessionId1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    // //Create Quiz
    // const quizId1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz').bodyObj.quizId;
    // //Create question
    // adminQuestionCreate(sessionId1, quizId1, questionBody1); // TODO change to V2 once implemented
    // // Start a session
    // adminQuizSessionStart(sessionId1, quizId1, 5);

    // //TODO playerJoin

    // //TODO valid player Id byt unvalid question position
    // // const qpInfoPlayer1 = playerQuestionPositionInfo('', 0);
    // // expect(viewQuizSession1.statusCode).toStrictEqual(400);
    // // expect(qpInfoPlayer1 .bodyObj).toStrictEqual(ERROR);
  });
  test('session is not currently on this question', () => {

  });
  test('Session is in LOBBY, QUESTION_COUNTDOWN, or END state', () => {

  });    
  // 3.Success 200
  test('Success 200', () => {

  });
});

// =============================================================================
// ================        playerQuestionAnswerSubmit           ================
// =============================================================================

// TODO proper test, awaiting Venus to finish her function before i can properly test

describe('Complete Test for playerQuestionAnswerSubmit', () => {
  const invalidAnswerIds = [-4, 0];
  beforeEach(() => {
    clear();
  });
  test('400 if player ID does not exist', () => {
    // expect(() => playerQuestionAnswerSubmit('', 1,invalidAnswerIds)).toThrow(HTTPError[400]);
  });
  test('400 if question position is not valid for the session this player is in', () => {

  });
  test('400 if session is not in QUESTION_OPEN state', () => {

  });
  test('400 if session is not yet up to this question', () => {

  });    

  test('400 if answer IDs are not valid for this particular question', () => {

  });    

  test('400 if there are duplicate answer IDs provided', () => {

  });    

  test('400 if less than 1 answer ID was submitted', () => {

  });    
  // 3.Success 200
  test('Success 200', () => {

  });
  test('Allow the current player to submit answer(s) to the currently active question.', () => {

  });
});


// =============================================================================
// =================          playerReturnAllChat          =====================
// =============================================================================


// TODO ASH



// =============================================================================
// ===============          playerFinalResults           =======================
// =============================================================================


// TODO ASH




// =============================================================================
// ================          playerQuestionResults          ====================
// =============================================================================







// =============================================================================
// ==================          playerSendChat           ========================
// =============================================================================
