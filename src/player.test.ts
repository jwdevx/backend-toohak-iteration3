test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});
import {
//   UserCreateReturn,QuizCreateReturn
  // TODO
} from './returnInterfaces';
import {
//   clear,
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

// const ERROR = { error: expect.any(String) };
// beforeEach(() => {
//   clear();
// });

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

    /**
     //Register User
    let sessionId1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').jsonBody as UserCreateReturn).token;   
    

    // //Create Quiz
    const quizId1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    console.log(quizId1);   
    
     */

    // const sessionId1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    // console.log(sessionId1);
    // console.log(sessionId1.token);



    // let t: UserCreateReturn;
    // const { jsonBody } = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    // t = jsonBody as UserCreateReturn;
    // const quizId1 = adminQuizCreate(t.token, 'quiz1', 'first quiz');
    // console.log(quizId1);


    // //Create question
    // adminQuestionCreate(sessionId1, quizId1, questionBody1); // TODO change to V2 once implemented
    // // Start a session
    // adminQuizSessionStart(sessionId1, quizId1, 5);


                // let token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').jsonBody as UserCreateReturn).token;
                // console.log(token1);
                // // const quizId1 = adminQuizCreate(token1, 'quiz1', 'first quiz');

                // const quizId1= (adminQuizCreate(token1, 'quiz1', 'first quiz').jsonBody as  QuizCreateReturn).quizId;
                // console.log(quizId1);

/*

    beforeEach(() => {
      reqClear();
      token1 = (reqAdminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').jsonBody as UserCreateReturn).token;
      token2 = (reqAdminAuthLogin('iloveemails@gmail.com', 'iloveemail1234').jsonBody as UserCreateReturn).token;
    });
    
    test('Successful logout', () => {
      expect(reqAdminAuthLogoutV2(token1).jsonBody).toStrictEqual({});
      expect(reqAdminAuthLogoutV2(token2).jsonBody).toStrictEqual({});
    });
    
    test('Error: Token is empty or invalid (does not refer to valid logged in user quiz session)', () => {
      expect(() => reqAdminAuthLogoutV2('')).toThrow(HTTPError[401]);
    
      reqAdminAuthLogoutV2(token1);
      // token1 is not logged in right now
      expect(() => reqAdminAuthLogoutV2(token1)).toThrow(HTTPError[401]);
    });
  
  
    const token1 = (reqAdminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').jsonBody as UserCreateReturn).token;

*/

    
    // test('Successful logout', () => {
    //   expect(reqAdminAuthLogoutV2(token1).jsonBody).toStrictEqual({});
    //   expect(reqAdminAuthLogoutV2(token2).jsonBody).toStrictEqual({});
    // });
    
    // test('Error: Token is empty or invalid (does not refer to valid logged in user quiz session)', () => {
    //   expect(() => reqAdminAuthLogoutV2('')).toThrow(HTTPError[401]);
    
    //   reqAdminAuthLogoutV2(token1);
    //   // token1 is not logged in right now
    //   expect(() => reqAdminAuthLogoutV2(token1)).toThrow(HTTPError[401]);
    // });
  
   

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
/*
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
*/

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
