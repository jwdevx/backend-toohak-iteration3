import { clear } from './apiRequests';

//auth.ts
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
  
  //Trash
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
const ERROR_NUMBER = { error: expect.any(Number) };
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
      console.log(success);
      const login = adminAuthLogin('hayden.smith@unsw.edu.au', 'WOjiaoZC123');
      expect(login.statusCode).toStrictEqual(200);
      expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });
    });
    
	test(' Combo1 ', () => {
			
			//* adminAuthRegister - User 1 - Session 1
      const user1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
			expect(user1.statusCode).toStrictEqual(200);
			const user1_sessionId1_string = user1.bodyObj.token;					
			expect(user1.bodyObj).toStrictEqual({ token: expect.any(String) });
			const sessionId_number = Number(decodeURIComponent(user1.bodyObj.token));
			expect(sessionId_number).not.toBeNaN();


      //* adminAuthLogin - Successful login for User 1 - Session 2
			let login1User1 = adminAuthLogin('hayden1.smith@unsw.edu.au', '1234abcd');
			expect(login1User1.statusCode).toStrictEqual(200);
			expect(login1User1.bodyObj).toHaveProperty('token');
			expect(login1User1.bodyObj).toStrictEqual({ token: expect.any(String) });
			let user1_sessionId2_string = login1User1.bodyObj.token;	
          
			//* adminAuthRegister - User 2 
      const user2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith')
      expect(user2.statusCode).toStrictEqual(200);
      const user2_sessionId1_string = user2.bodyObj.token;
  
      // adminQuizCreate - User1 Create Quiz1
      const quiz1 = adminQuizCreate(user1_sessionId1_string, 'quiz1name', 'quiz1description');
			expect(quiz1.statusCode).toStrictEqual(200);
      const user1_quiz1_Id_number = quiz1.bodyObj.quizId;
   
			//adminQuizCreate - User1 Create Quiz2
      const quiz2 = adminQuizCreate(user1_sessionId1_string, 'quiz2name', 'quiz2description');
      expect(quiz2.statusCode).toStrictEqual(200);    
      const user1_quiz2_Id_number = quiz2.bodyObj.quizId;

//------------------------------------------------------------------------------    
			// adminQuizList - List quizzes for User 1
			let quizListUser1 = adminQuizList(user1_sessionId1_string);
			expect(quizListUser1.statusCode).toStrictEqual(200);
			expect(quizListUser1.bodyObj).toHaveProperty('quizzes');
			expect(quizListUser1.bodyObj.quizzes.length).toStrictEqual(2);
          
      // adminQuizinfo - User 1 Quiz1
      const quizInfo_quiz1_user1 = adminQuizInfo(user1_sessionId1_string, user1_quiz1_Id_number);
      expect(quizInfo_quiz1_user1.statusCode).toStrictEqual(200);
      expect(quizInfo_quiz1_user1.bodyObj).toStrictEqual({
        quizId: user1_quiz1_Id_number,
        name: 'quiz1name',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'quiz1description',
        numQuestions: 0,
        questions: [],
      });			
    
      // adminQuizRemove - User1 remove Quiz1 in trash
      const quiz1Remove = adminQuizRemove(user1_sessionId1_string, user1_quiz1_Id_number);
      expect(quiz1Remove.statusCode).toBe(200);
  
      // adminQuizTrashEmpty - Error 401 'Token is empty or not provided'
      const emptyRes1 = adminQuizTrashEmpty('', JSON.stringify([user1_quiz1_Id_number]));
      expect(emptyRes1.statusCode).toBe(401);
      expect(emptyRes1.bodyObj).toStrictEqual(ERROR_STRING);
  
      // adminQuizTrashEmpty - Error 400  'One or more of the Quiz IDs is not currently in the trash'
      const emptyRes2 = adminQuizTrashEmpty(user1_sessionId1_string, JSON.stringify([user1_quiz1_Id_number, quiz2.bodyObj.quizId]));
      expect(emptyRes2.statusCode).toBe(400);
      expect(emptyRes2.bodyObj).toStrictEqual(ERROR_STRING);
  
      // adminQuizTrashEmpty- Error 403 'Valid token is provided, but one or more of the Quiz IDs is not Quiz owner'
      const emptyRes3 = adminQuizTrashEmpty(user2_sessionId1_string, JSON.stringify([user1_quiz1_Id_number]));
      expect(emptyRes3.statusCode).toBe(403);
      expect(emptyRes3.bodyObj).toStrictEqual(ERROR_STRING);
  
      // adminQuizTrashEmpty - 200 - success permanently delete
      const emptyRes4 = adminQuizTrashEmpty(user1_sessionId1_string, JSON.stringify([user1_quiz1_Id_number]));
      expect(emptyRes4.statusCode).toBe(200);
      expect(emptyRes4.bodyObj).toStrictEqual({});
      
			//! NOMORE - user1_quiz1_Id_number
      
      //TODO view
      
      //TODO empty

//------------------------------------------------------------------------------  

    
			//* adminAuthLogout - Logout User 1 successfully
			const logout1User1 = adminAuthLogout(user1_sessionId1_string);
			expect(logout1User1.statusCode).toBe(200);
			expect(logout1User1.bodyObj).toStrictEqual({});
			
      //! NOMORE - user1_sessionId1_string
      
			//* adminUserDetails - Error 401 'Token is empty or invalid (does not refer to valid logged in user session)'
			const detailsUser1 = adminUserDetails(user1_sessionId1_string);
			expect(detailsUser1.statusCode).toBe(401);
			expect(detailsUser1.bodyObj).toStrictEqual(ERROR_STRING);
 		
			//* adminAuthLogin - Failed login for User 1 for Session 3
      //Failed 1
      login1User1 = adminAuthLogin('hayden1.smith@unsw.edu.au', '1234abcd9999');
			expect(login1User1.statusCode).toStrictEqual(400);
      expect(login1User1.bodyObj).toStrictEqual(ERROR_STRING);
 
      //Failed 2
      login1User1 = adminAuthLogin('hayden11.smith@unsw.edu.au', '1234abcd');
			expect(login1User1.statusCode).toStrictEqual(400);
      expect(login1User1.bodyObj).toStrictEqual(ERROR_STRING);
      
			//* adminUserDetails - Failed + Success Retrieve User 1 details 
			let userDetailsUser1 = adminUserDetails(user1_sessionId1_string);
			expect(userDetailsUser1.statusCode).toStrictEqual(401);
      expect(userDetailsUser1.bodyObj).toStrictEqual(ERROR_STRING);
          
      userDetailsUser1 = adminUserDetails(user1_sessionId2_string);
      expect(userDetailsUser1.bodyObj).toStrictEqual({
        response: {
          user: {
            userId: 1,
            name: 'Hayden Smith',
            email: 'hayden1.smith@unsw.edu.au',
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 2,
          },
        }
      });
    
      //* adminAuthLogin - Successful login for User 1 - Session 3
			login1User1 = adminAuthLogin('hayden1.smith@unsw.edu.au', '1234abcd');
			expect(login1User1.statusCode).toStrictEqual(200);
			expect(login1User1.bodyObj).toHaveProperty('token');
			expect(login1User1.bodyObj).toStrictEqual({ token: expect.any(String) });
			let user1_sessionId3_string = login1User1.bodyObj.token;	
    
      userDetailsUser1 = adminUserDetails(user1_sessionId2_string);
      expect(userDetailsUser1.bodyObj).toStrictEqual({
        response: {
          user: {
            userId: 1,
            name: 'Hayden Smith',
            email: 'hayden1.smith@unsw.edu.au',
            numSuccessfulLogins: 3,
            numFailedPasswordsSinceLastLogin: 0,
          },
        }
      });
                    
//------------------------------------------------------------------------------ 		

			//* adminUserDetailsUpdate - Update User 1 name successfully
			let updateDetailsUser1 = adminUserDetailsUpdate(
        user1_sessionId1_string,
        'hayden1.smith@unsw.edu.au',
        'HaydenUpdate',
        'SmithUpdate',
      );
			expect(updateDetailsUser1.statusCode).toStrictEqual(401);      
			updateDetailsUser1 = adminUserDetailsUpdate(
        user1_sessionId2_string,
        'hayden1.smith@unsw.edu.au',
        'HaydenUpdate',
        'SmithUpdate',
      );
			expect(updateDetailsUser1.statusCode).toStrictEqual(200);

			//* adminUserPasswordUpdate - Failed + Update User 1 password successfully
      let updateUser1Password1 = adminUserPasswordUpdate(user1_sessionId2_string, 'password1', 'password1');
			expect(updateUser1Password1.statusCode).toStrictEqual(400);
			expect(updateUser1Password1.bodyObj).toStrictEqual(ERROR_STRING);
      
      updateUser1Password1 = adminUserPasswordUpdate(user1_sessionId1_string, 'password1', 'password1Update1');
			expect(updateUser1Password1.statusCode).toStrictEqual(401);
      expect(updateUser1Password1.bodyObj).toStrictEqual(ERROR_STRING);

    
      const success = adminUserPasswordUpdate(user1_sessionId2_string, '1234abcd', 'WOjiaoZC123');
      expect(success.statusCode).toStrictEqual(200);
      const login = adminAuthLogin('hayden1.smith@unsw.edu.au', 'WOjiaoZC123');
      expect(login.statusCode).toStrictEqual(200);
      expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });    
      
			// updateUser1Password1 = adminUserPasswordUpdate(user1_sessionId2_string, 'password1', 'password1_Update1');
			// expect(updateUser1Password1.statusCode).toStrictEqual(200);
      // expect(updateUser1Password1.bodyObj).toStrictEqual({});
    
			// adminQuizList - List quizzes for User 1
			quizListUser1 = adminQuizList(user1_sessionId2_string);
			expect(quizListUser1.statusCode).toStrictEqual(200);
			expect(quizListUser1.bodyObj).toHaveProperty('quizzes');
			expect(quizListUser1.bodyObj.quizzes.length).toStrictEqual(1);  
      
    
      //TODO not implementated      
      /*
			// adminQuizNameUpdate - Successfully update Quiz1 name
			const user1_quiz2_NameUpdate = adminQuizNameUpdate(user1_quiz2_Id_number, user1_sessionId2_string, 'quiz1name_Update1');
			expect(user1_quiz2_NameUpdate.statusCode).toStrictEqual(200);

      // adminQuizDescriptionUpdate - Successfully update Quiz1 description
			const user1_quiz2_quizDescUpdate = adminQuizDescriptionUpdate(user1_quiz2_Id_number, user1_sessionId2_string, 'quiz1description_Update1');
			expect(user1_quiz2_quizDescUpdate.statusCode).toStrictEqual(200);
      */
			//TODO Continue with more tests for quiz trash view, restore, emptying, and question operations...

    
      // TODO adminQuizinfo - User 1 Quiz1 //aim to check time last edited
        
      const QuestionBody = {
   
          "question": "Who is the Monarch of England?",
          "duration": 4,
          "points": 5,
          "answers": [
            {
              "answer": "Prince Charles",
              "correct": true
            }
          ]
   
      }      
			// Example: adminQuestionCreate - Create a question for Quiz1
			const questionCreate = adminQuestionCreate(user1_sessionId2_string, user1_quiz2_Id_number, QuestionBody);
			expect(questionCreate.statusCode).toStrictEqual(200);
			expect(questionCreate.bodyObj).toHaveProperty('questionId');		
			const questionId_number = questionCreate.bodyObj.questionId
			expect(questionId_number).not.toBeNaN();		
    
    });
});
  

//------------------------------------------------------------------------------
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