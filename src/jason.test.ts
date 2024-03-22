import { clear } from './apiRequests';

// auth.ts
import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout,
} from './apiRequests';

import {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  // adminQuizNameUpdate,
  // adminQuizDescriptionUpdate,

  // Trash
  adminQuizRemove,
  // adminQuizTrashView,
  // adminQuizTrashRestore,
  adminQuizTrashEmpty,
} from './apiRequests';

import {
  adminQuestionCreate,
  // adminQuestionUpdate,
  // adminQuestionMove,
  // adminQuestionDuplicate,
  // adminQuestionDelete,
} from './apiRequests';

const ERROR_STRING = { error: expect.any(String) };
// const ERROR_NUMBER = { error: expect.any(Number) };
// const OK = 200;
// const BAD_REQUEST = 400;
// const UNAUTHORIZED = 401;
// const FORBIDDEN = 403;

beforeEach(() => {
  clear();
});

/*

*/

describe('Further testing on Iteration 2 ', () => {
  beforeEach(() => {
    clear();
  });
  test('Success Case Password Update', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const success = adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', 'WOjiaoZC123');
    expect(success.statusCode).toStrictEqual(200);
    expect(success.bodyObj).toStrictEqual({});
    // console.log(success);
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', 'WOjiaoZC123');
    expect(login.statusCode).toStrictEqual(200);
    expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });
  });

  test(' Combo1 ', () => {
    //* adminAuthRegister - User 1 - Session 1
    let user1 = adminAuthRegister('', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    user1 = adminAuthRegister('     ', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', '', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', '');
    expect(user1.statusCode).toStrictEqual(400);
    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(200);
    const user1SessionId1String = user1.bodyObj.token;
    expect(user1.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionIdNumber = Number(decodeURIComponent(user1.bodyObj.token));
    expect(sessionIdNumber).not.toBeNaN();

    //* adminAuthLogin - Successful login for User 1 - Session 2
    const login1User1 = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd');
    expect(login1User1.statusCode).toStrictEqual(200);
    expect(login1User1.bodyObj).toHaveProperty('token');
    expect(login1User1.bodyObj).toStrictEqual({ token: expect.any(String) });
    const user1SessionId2String = login1User1.bodyObj.token;

    //* adminAuthRegister - User 2
    const user2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(user2.statusCode).toStrictEqual(200);
    const user2SessionId1String = user2.bodyObj.token;

    // adminQuizCreate - User1 Create Quiz1
    const quiz1 = adminQuizCreate(user1SessionId1String, 'quiz1name', 'quiz1description');
    expect(quiz1.statusCode).toStrictEqual(200);
    const user1Quiz1IdNumber = quiz1.bodyObj.quizId;

    // adminQuizCreate - User1 Create Quiz2
    const quiz2 = adminQuizCreate(user1SessionId1String, 'quiz2name', 'quiz2description');
    expect(quiz2.statusCode).toStrictEqual(200);
    const user1Quiz2IdNumber = quiz2.bodyObj.quizId;
    // console.log(user1Quiz2IdNumber);

    // ------------------------------------------------------------------------------

    // PASS course_tests / tests / quiz_tests / quizDescriptionUpdate.test.js
    /*
const quizdescription = adminQuizDescriptionUpdate(user1SessionId1String, user1Quiz1IdNumber, 'new description');
const quizState1 = adminQuizInfo(user1SessionId1String, user1Quiz1IdNumber);
expect(quizState1.bodyObj.timeLastEdited).not.toEqual(quizState1.bodyObj.timeCreated);
expect(quizState1.bodyObj.timeLastEdited).toBeGreaterThan(quizState1.bodyObj.timeCreated);
    */

    // PASS course_tests/tests/auth_tests/userDetails.test.js
    // PASS course_tests/tests/quiz_tests/quizNameUpdate.test.js
    // FAIL course_tests/tests/quiz_tests/quizInfo.test.js

    // ------------------------------------------------------------------------------
    // adminQuizList - List quizzes for User 1
    let quizListUser1 = adminQuizList(user1SessionId1String);
    expect(quizListUser1.statusCode).toStrictEqual(200);
    expect(quizListUser1.bodyObj).toHaveProperty('quizzes');
    expect(quizListUser1.bodyObj.quizzes.length).toStrictEqual(2);

    // adminQuizinfo - User 1 Quiz1
    const quizInfoQuiz1User1 = adminQuizInfo(user1SessionId1String, user1Quiz1IdNumber);
    expect(quizInfoQuiz1User1.statusCode).toStrictEqual(200);
    expect(quizInfoQuiz1User1.bodyObj).toStrictEqual({
      quizId: user1Quiz1IdNumber,
      name: 'quiz1name',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1description',
      numQuestions: 0,
      questions: [],
    });
    expect(quizInfoQuiz1User1.bodyObj.timeCreated.toString()).toMatch(/^\d{10}$/);
    expect(quizInfoQuiz1User1.bodyObj.timeLastEdited.toString()).toMatch(/^\d{10}$/);

    // adminQuizRemove - User1 remove Quiz1 in trash
    const quiz1Remove = adminQuizRemove(user1SessionId1String, user1Quiz1IdNumber);
    expect(quiz1Remove.statusCode).toBe(200);

    // adminQuizTrashEmpty - Error 401 'Token is empty or not provided'
    const emptyRes1 = adminQuizTrashEmpty('', JSON.stringify([user1Quiz1IdNumber]));
    expect(emptyRes1.statusCode).toBe(401);
    expect(emptyRes1.bodyObj).toStrictEqual(ERROR_STRING);

    // adminQuizTrashEmpty - Error 400  'One or more of the Quiz IDs is not currently in the trash'
    const emptyRes2 = adminQuizTrashEmpty(user1SessionId1String, JSON.stringify([user1Quiz1IdNumber, quiz2.bodyObj.quizId]));
    expect(emptyRes2.statusCode).toBe(400);
    expect(emptyRes2.bodyObj).toStrictEqual(ERROR_STRING);

    // adminQuizTrashEmpty- Error 403 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner'
    const emptyRes3 = adminQuizTrashEmpty(user2SessionId1String, JSON.stringify([user1Quiz1IdNumber]));
    expect(emptyRes3.statusCode).toBe(403);
    expect(emptyRes3.bodyObj).toStrictEqual(ERROR_STRING);

    // adminQuizTrashEmpty - 200 - success permanently delete
    const emptyRes4 = adminQuizTrashEmpty(user1SessionId1String, JSON.stringify([user1Quiz1IdNumber]));
    expect(emptyRes4.statusCode).toBe(200);
    expect(emptyRes4.bodyObj).toStrictEqual({});

    //! NOMORE - user1Quiz1IdNumber

    // TODO view

    // TODO empty

    // ------------------------------------------------------------------------------

    //* adminAuthLogout - Logout User 1 successfully
    const logout1User1 = adminAuthLogout(user1SessionId1String);
    expect(logout1User1.statusCode).toBe(200);
    expect(logout1User1.bodyObj).toStrictEqual({});

    //! NOMORE - user1SessionId1String

    //* adminUserDetails - Error 401 'Token is empty or invalid (does not refer to valid logged in user session)'
    const detailsUser1 = adminUserDetails(user1SessionId1String);
    expect(detailsUser1.statusCode).toBe(401);
    expect(detailsUser1.bodyObj).toStrictEqual(ERROR_STRING);

    //* adminAuthLogin - Failed login for User 1 for Session 3
    // Failed 1
    let failedlogin1User1 = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd9999');
    expect(failedlogin1User1.statusCode).toStrictEqual(400);
    expect(failedlogin1User1.bodyObj).toStrictEqual(ERROR_STRING);

    // Failed 2
    failedlogin1User1 = adminAuthLogin('hayden.smith@unsw.edu.au', 'jkggrdyj');
    expect(failedlogin1User1.statusCode).toStrictEqual(400);
    expect(failedlogin1User1.bodyObj).toStrictEqual(ERROR_STRING);

    //* adminUserDetails - Failed + Success Retrieve User 1 details
    let userDetailsUser1 = adminUserDetails(user1SessionId1String);
    expect(userDetailsUser1.statusCode).toStrictEqual(401);
    expect(userDetailsUser1.bodyObj).toStrictEqual(ERROR_STRING);

    userDetailsUser1 = adminUserDetails(user1SessionId2String);
    // console.log(userDetailsUser1);
    expect(userDetailsUser1.bodyObj).toStrictEqual({
      user: {
        userId: 1,
        name: 'Hayden Smith',
        email: 'hayden.smith@unsw.edu.au',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });

    //* adminAuthLogin - Successful login for User 1 - Session 3
    const login2User1 = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd');
    expect(login2User1.statusCode).toStrictEqual(200);
    expect(login2User1.bodyObj).toHaveProperty('token');
    expect(login2User1.bodyObj).toStrictEqual({ token: expect.any(String) });
    const user1SessionId3String = login2User1.bodyObj.token;

    userDetailsUser1 = adminUserDetails(user1SessionId3String);
    // console.log(userDetailsUser1);
    expect(userDetailsUser1.bodyObj).toStrictEqual({
      user: {
        userId: 1,
        name: 'Hayden Smith',
        email: 'hayden.smith@unsw.edu.au',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    // ------------------------------------------------------------------------------

    //* adminUserDetailsUpdate - Update User 1 name successfully
    let updateDetailsUser1 = adminUserDetailsUpdate(
      user1SessionId1String,
      'hayden1.smith@unsw.edu.au',
      'HaydenUpdate',
      'SmithUpdate'
    );
    expect(updateDetailsUser1.statusCode).toStrictEqual(401);
    updateDetailsUser1 = adminUserDetailsUpdate(
      user1SessionId2String,
      'hayden1.smith@unsw.edu.au',
      'HaydenUpdate',
      'SmithUpdate'
    );
    expect(updateDetailsUser1.statusCode).toStrictEqual(200);

    //* adminUserPasswordUpdate - Failed + Update User 1 password successfully
    // invalid token
    let updateUser1Password1 = adminUserPasswordUpdate(user1SessionId1String, 'password1', 'password1Update1');
    expect(updateUser1Password1.statusCode).toStrictEqual(401);
    expect(updateUser1Password1.bodyObj).toStrictEqual(ERROR_STRING);

    updateUser1Password1 = adminUserPasswordUpdate(user1SessionId2String, 'password1', 'password1');
    expect(updateUser1Password1.statusCode).toStrictEqual(400);
    expect(updateUser1Password1.bodyObj).toStrictEqual(ERROR_STRING);

    const success = adminUserPasswordUpdate(user1SessionId2String, '1234abcd', 'WOjiaoZC123');
    expect(success.statusCode).toStrictEqual(200);
    const login = adminAuthLogin('hayden1.smith@unsw.edu.au', 'WOjiaoZC123');
    expect(login.statusCode).toStrictEqual(200);
    expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });

    // updateUser1Password1 = adminUserPasswordUpdate(user1SessionId2String, 'password1', 'password1_Update1');
    // expect(updateUser1Password1.statusCode).toStrictEqual(200);
    // expect(updateUser1Password1.bodyObj).toStrictEqual({});

    // adminQuizList - List quizzes for User 1
    quizListUser1 = adminQuizList(user1SessionId2String);
    expect(quizListUser1.statusCode).toStrictEqual(200);
    expect(quizListUser1.bodyObj).toHaveProperty('quizzes');
    expect(quizListUser1.bodyObj.quizzes.length).toStrictEqual(1);

    // TODO not implementated
    /*
    // adminQuizNameUpdate - Successfully update Quiz1 name
    const user1_quiz2_NameUpdate = adminQuizNameUpdate(user1Quiz2IdNumber, user1SessionId2String, 'quiz1name_Update1');
    expect(user1_quiz2_NameUpdate.statusCode).toStrictEqual(200);

    // adminQuizDescriptionUpdate - Successfully update Quiz1 description
    const user1_quiz2_quizDescUpdate = adminQuizDescriptionUpdate(user1Quiz2IdNumber, user1SessionId2String, 'quiz1description_Update1');
    expect(user1_quiz2_quizDescUpdate.statusCode).toStrictEqual(200);
    */
    // TODO Continue with more tests for quiz trash view, restore, emptying, and question operations...

    // TODO adminQuizinfo - User 1 Quiz1 //aim to check time last edited

    const questionBody1 = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: true
        },
        {
          answer: '1Prince Charles',
          correct: false
        }
      ]
    };

    // Example: adminQuestionCreate - Create a question for Quiz1
    let questionCreate = adminQuestionCreate(user1SessionId3String, user1Quiz2IdNumber, questionBody1);
    // console.log(questionCreate);
    expect(questionCreate.statusCode).toStrictEqual(200);
    expect(questionCreate.bodyObj).toStrictEqual({ questionId: expect.any(Number) });
    const questionIdNumber = questionCreate.bodyObj.questionId;
    expect(questionIdNumber).not.toBeNaN();

    // error exceed time
    let questionBody2 = {
      question: 'Who is the Monarch of England?',
      duration: 177,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: true
        },
        {
          answer: '1Prince Charles',
          correct: false
        }
      ]
    };
    questionCreate = adminQuestionCreate(user1SessionId3String, user1Quiz2IdNumber, questionBody2);
    expect(questionCreate.statusCode).toStrictEqual(400);

    // error same questions
    questionBody2 = {
      question: 'Who is the Monarch of England?',
      duration: 5,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: true
        },
        {
          answer: 'Prince Charles',
          correct: false
        }
      ]
    };
    questionCreate = adminQuestionCreate(user1SessionId3String, user1Quiz2IdNumber, questionBody2);
    expect(questionCreate.statusCode).toStrictEqual(400);

    /*
        const quizInfo_quiz2_user1 = adminQuizInfo(user1SessionId3String, user1Quiz2IdNumber);
        expect(quizInfo_quiz2_user1.statusCode).toStrictEqual(200);

        console.log(quizInfo_quiz2_user1);

        expect(quizInfo_quiz2_user1.bodyObj).toStrictEqual({

          quizId: user1Quiz2IdNumber,
          name: 'quiz2name',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'quiz2description',
          numQuestions: 1,
            questions: [

                {
                    questionId: expect.any(Number),
                    question: "Who is the Monarch of England?",
                    duration: 4,
                    points: 5,
                    answers: [
                        {
                            answerId: expect.any(Number),
                            answer: "Prince Charles",
                        colour:expect.any(String),
                        correct: true
                      },
                      {answerId: expect.any(Number),
                          answer: "1Prince Charles",
                          colour:expect.any(String),
                        correct: false
                      }
                    ]
                  },
            ],
            duration: 4,
        });
        expect(quizInfo_quiz2_user1.bodyObj.timeLastEdited).not.toEqual(quizInfo_quiz2_user1.bodyObj.timeCreated);
        expect(quizInfo_quiz2_user1.bodyObj.timeLastEdited).toBeGreaterThan(quizInfo_quiz2_user1.bodyObj.timeCreated);

    */
  });
});

// ------------------------------------------------------------------------------
/*
PASS course_tests/tests/auth_tests/authRegister.test.js
PASS course_tests/tests/auth_tests/userPasswordUpdate.test.js
PASS course_tests/tests/auth_tests/userDetailsUpdate.test.js
PASS course_tests/tests/quiz_tests/quizCreate.test.js
PASS course_tests/tests/quiz_tests/quizDescriptionUpdate.test.js
PASS course_tests/tests/auth_tests/userDetails.test.js
PASS course_tests/tests/quiz_tests/quizNameUpdate.test.js
FAIL course_tests/tests/quiz_tests/quizInfo.test.js
  â— Test successful quiz read - correct timestamp format

    expect(received).toMatch(expected)

    Expected pattern: /^\d{10}$/
    Received string:  "March 10, 2024 12:33 AM"

      24 | test('Test successful quiz read - correct timestamp format', () => {
      25 |   const quiz = adminQuizInfo(userId, quizId);
    > 26 |   expect(quiz.timeCreated.toString()).toMatch(/^\d{10}$/);
         |                                       ^
      27 |   expect(quiz.timeLastEdited.toString()).toMatch(/^\d{10}$/);
      28 | });
      29 |

      at Object.toMatch (course_tests/tests/quiz_tests/quizInfo.test.js:26:39)

  â— Test successful quiz read after edit is different to creation time

    expect(received).not.toEqual(expected) // deep equality

    Expected: not "March 10, 2024 12:33 AM"

      33 |     adminQuizDescriptionUpdate(userId, quizId, 'new description');
      34 |     const quizState1 = adminQuizInfo(userId, quizId);
    > 35 |     expect(quizState1.timeLastEdited).not.toEqual(quizState1.timeCreated);
         |                                           ^
      36 |     expect(quizState1.timeLastEdited).toBeGreaterThan(quizState1.timeCreated);
      37 |   }, 1500);
      38 |   jest.runAllTimers();

      at toEqual (course_tests/tests/quiz_tests/quizInfo.test.js:35:43)
      at callTimer (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:745:24)
      at Object.next (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1427:17)
      at Object.runAll (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1486:23)
      at FakeTimers.runAllTimers (node_modules/@jest/fake-timers/build/modernFakeTimers.js:60:19)
      at Object.runAllTimers (course_tests/tests/quiz_tests/quizInfo.test.js:38:8)

PASS course_tests/tests/auth_tests/authLogin.test.js
PASS course_tests/tests/other_tests/clear.test.js
PASS course_tests/tests/quiz_tests/quizRemove.test.js
PASS course_tests/tests/quiz_tests/quizList.test.js

Test Suites: 1 failed, 11 passed, 12 total
Tests:       2 failed, 67 passed, 69 total
Snapshots:   0 total
Time:        4.961 s
Ran all test suites matching /course_tests\//i.
npm verb exit 1
npm verb code 1
*/

/* ----------------------------   WARNING   ------------------------------------
Please note, when you have a single route (e.g. /my/route/name)
alongside a wildcard route (e.g. /my/route/{variable})
you need to define the single route before the variable route.

Must Follow this order in server.ts, as well when adding function for ITERATION 3

Clear
  DELETE /v1/clear - JASON

Authentication and User Management
  POST /v1/admin/auth/register - JASON
  POST /v1/admin/auth/login - VENUS
  GET /v1/admin/user/details - VENUS
  PUT /v1/admin/user/details - JASON
  PUT /v1/admin/user/password - VENUS
  POST /v1/admin/auth/logout - JASON

Quiz Management (General)
  POST /v1/admin/quiz - SADAT
  GET /v1/admin/quiz/list - CHENG
  GET /v1/admin/quiz/trash - CHENG
  DELETE /v1/admin/quiz/trash/empty - JASON

Quiz-Specific Routes
  GET /v1/admin/quiz/{quizid} - SADAT
  DELETE /v1/admin/quiz/{quizid} - CHENG
  PUT /v1/admin/quiz/{quizid}/name - ASH
  PUT /v1/admin/quiz/{quizid}/description - ASH
  POST /v1/admin/quiz/{quizid}/restore - CHENG
  POST /v1/admin/quiz/{quizid}/transfer - VENUS

Question-Specific Routes
  POST /v1/admin/quiz/{quizid}/question - CHENG
  PUT /v1/admin/quiz/{quizid}/question/{questionid} - ASH
  DELETE /v1/admin/quiz/{quizid}/question/{questionid} - SADAT
  PUT /v1/admin/quiz/{quizid}/question/{questionid}/move - SADAT
  POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - ASH
*/
