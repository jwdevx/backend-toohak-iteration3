
/* eslint-disable */
// @ts-nocheck
//TODO REMOVE THIS 2 COMMENTS ABOVE when this file is lintsafe and typesafe

/*
currently there is this 12  number of errors in typecheck in this file:
	7  src/quiz.test.ts:107


Please run:
	npm test
	npm run lint
	npm run tsc


/import/ravel/5/z5494973/comp1531/project-backend/src/quiz.test.ts
    2:1   error  Too many blank lines at the beginning of file. Max of 1 allowed  no-multiple-empty-lines
    8:7   error  'ERROR' is assigned a value but never used                       @typescript-eslint/no-unused-vars
   15:11  error  'id' is assigned a value but never used                          @typescript-eslint/no-unused-vars
   53:11  error  'id1' is assigned a value but never used                         @typescript-eslint/no-unused-vars
   94:11  error  'quiz' is assigned a value but never used                        @typescript-eslint/no-unused-vars
  205:11  error  'quizId2' is assigned a value but never used                     @typescript-eslint/no-unused-vars
  218:11  error  'quizId1' is assigned a value but never used                     @typescript-eslint/no-unused-vars
  295:11  error  'QuizCrt' is assigned a value but never used                     @typescript-eslint/no-unused-vars
  353:11  error  'QuizCrt2' is assigned a value but never used                    @typescript-eslint/no-unused-vars
  405:11  error  'QuizCrt' is assigned a value but never used                     @typescript-eslint/no-unused-vars

*/
//TODO REMOVE ALL COMMENTS ABOVE -----------------------------------------------
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

import {
  adminQuizCreate, 
  adminAuthRegister,
  adminQuizList,
  adminQuizRemove,
  clear
} from './apiRequests';
/*
import { adminQuizCreate, adminQuizList, adminQuizInfo, adminQuizRemove, adminQuizNameUpdate, adminQuizDescriptionUpdate } from './quiz';
import { clear } from './other';
import { adminAuthRegister, adminAuthLogin } from './auth';
*/

beforeEach(() => {
    clear();
  });
const ERROR = { error: expect.any(String) };


// =============================================================================
// ============================ adminQuizCreate ==================================
// =============================================================================

   


describe('Testing create quizzes return quiz id', () => {
  beforeEach(() => {
    clear();
  });
  test('Check successfully quiz addition', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    const quiz = adminQuizCreate(res.bodyObj.token, 'yourname', 'yourdescription');
    expect(quiz.statusCode).toStrictEqual(200);
    expect(quiz.bodyObj).toStrictEqual({ quizId: expect.any(Number)});  

  });
    

  test('Check invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    
    const Quiz1 = adminQuizCreate(wrongtoken, 'tests', 'autotesting');

    expect(Quiz1.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(Quiz1.statusCode).toStrictEqual(401);
    
  });

  
  test('check invalid characters', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'quiz@/500', 'i love autotests');
    const Quiz1Body = Quiz1.bodyObj;
    const Quiz1Status = Quiz1.statusCode;
    expect(Quiz1Body).toStrictEqual({ error: expect.any(String) });
    expect(Quiz1Status).toStrictEqual(BAD_REQUEST);
    
  });
  
  test('check invalid name length', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const Quiz1 = adminQuizCreate(user1, 'qq', 'quizzes are so fun');
    const Quiz1Body = Quiz1.bodyObj;
    const Quiz1Status = Quiz1.statusCode;
    expect(Quiz1Body).toStrictEqual({ error: expect.any(String) });
    expect(Quiz1Status).toStrictEqual(BAD_REQUEST);
  });
  
  test('check used quiz names', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    adminQuizCreate(user1, 'quiz1', 'first quiz');
    adminQuizCreate(user1, 'quiz2', 'Second quiz'); 
    const Quiz = adminQuizCreate(user1, 'quiz2', 'hahaha redundant naming');
    const QuizBody = Quiz.bodyObj;
    const QuizStatus = Quiz.statusCode;
    expect(QuizBody).toStrictEqual({ error: 'The name has already used for the quiz you created before' });
    expect(QuizStatus).toStrictEqual(BAD_REQUEST);
    
  });

  test('check invalid description length', () => {
    const user1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir').bodyObj.token;
    const longdescription = 'a'.repeat(150);
    const Quiz = adminQuizCreate(user1, 'quiz1', longdescription);
    const QuizBody = Quiz.bodyObj;
    const QuizStatus = Quiz.statusCode;
    expect(QuizBody).toStrictEqual({ error: expect.any(String) });
    expect(QuizStatus).toStrictEqual(BAD_REQUEST);
  });
  
});
  
// =============================================================================
// ======================      put test name here  =============================
// =============================================================================



describe('Testing print quiz list return quizzes', () => {
  beforeEach(() => {
    clear();
  });

  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    const List = adminQuizList(wrongtoken)
    expect(List.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(List.statusCode).toStrictEqual(UNAUTHORIZED);
  })

  test('correct input without trash', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz').bodyObj.quizId;
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz').bodyObj.quizId;
    const List = adminQuizList(sessionId)
    expect(List.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1,
          name: 'quiz1',
        },
        {
          quizId: quiz2,
          name: 'quiz2',
        }
      ]
    });
  });

  test('user does not have any quizzes', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const List = adminQuizList(sessionId)
    expect(List.bodyObj).toStrictEqual({
      quizzes: []
    })
  });
});

describe('Testing if adminQuizRemove successfully removes the given quiz', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid token', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const wrongtoken = encodeURIComponent(JSON.stringify(sessionId + 1));
    const remove = adminQuizRemove(wrongtoken, quiz1.bodyObj.quizId)
    expect(remove.bodyObj).toStrictEqual({ error: 'Token is invalid (does not refer to valid logged in user session)' });
    expect(remove.statusCode).toStrictEqual(UNAUTHORIZED);
  })
  test('invalid quiz id', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const invalidQuizId = quiz1.bodyObj.quizId
    const remove = adminQuizRemove(sessionId, quiz1.bodyObj.quizId + 9999)
    expect(remove.bodyObj).toStrictEqual({ error: 'Quiz ID does not refer to a valid quiz.' });
    expect(remove.statusCode).toStrictEqual(UNAUTHORIZED);  
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const token2 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'jason', 'wong');
    const sessionId1 = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const sessionId2 = (parseInt(decodeURIComponent(token2.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId1, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId2, 'quiz2', 'Second quiz');
    const remove = adminQuizRemove(sessionId2, quiz1.bodyObj.quizId);
    expect(remove.bodyObj).toStrictEqual({error: 'Quiz ID does not refer to a quiz that this user owns.'})
    expect(remove.statusCode).toStrictEqual(FORBIDDEN);
  });
  test('Successfully removed a quiz', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    const list = adminQuizList(sessionId);
    expect(list.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz2.bodyObj.quizId,
          name: 'quiz2',
        }
      ]
    })
  });
  test('Successfully removed multiple quizzes', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const quiz2 = adminQuizCreate(sessionId, 'quiz2', 'Second quiz');
    const quiz3 = adminQuizCreate(sessionId, 'quiz3', 'third quiz')
    adminQuizRemove(sessionId, quiz1.bodyObj.quizId);
    adminQuizRemove(sessionId, quiz2.bodyObj.quizId);
    const list = adminQuizList(sessionId);
    expect(list.bodyObj).toStrictEqual({
      quizzes: [
        {
          quizId: quiz3.bodyObj.quizId,
          name: 'quiz3',
        }
      ]
    })
  });
  test('testing the return type of adminQuizRemove', () => {
    const token1 = adminAuthRegister('sadat@gmail.com', 'WOjiaoZC123', 'Sadat', 'Kabir');
    const sessionId = (parseInt(decodeURIComponent(token1.bodyObj.token)));
    const quiz1 = adminQuizCreate(sessionId, 'quiz1', 'first quiz');
    const remove = adminQuizRemove(sessionId, quiz1.bodyObj.quizId)
    expect(remove.bodyObj).toStrictEqual({})
  });
});
/*
describe('Testing if adminQuizInfo prints the correct information', () => {
  beforeEach(() => {
    clear();
  });
  test('missing parameters', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const quizId = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(quizId.quizId)).toStrictEqual({ error: 'One or more missing parameters.' });
    expect(adminQuizInfo(authUser.authUserId)).toStrictEqual({ error: 'One or more missing parameters.' });
    expect(adminQuizInfo()).toStrictEqual({ error: 'One or more missing parameters.' });
  });
  test('invalid user id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const quizId = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(authUser.authUserId + 1, quizId.quizId)).toStrictEqual({ error: 'The user id is not valid.' });
  });
  test('invalid quiz id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const quizId = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(authUser.authUserId, quizId.quizId + 1)).toStrictEqual({ error: 'Quiz ID does not refer to a valid quiz.' });
  });
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const authUser2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
    const name1 = 'test1';
    const description1 = 'test1';
    const quizobj1 = adminQuizCreate(authUser1.authUserId, name1, description1);
    const name2 = 'test2';
    const description2 = 'test2';
    const quizobj2 = adminQuizCreate(authUser2.authUserId, name2, description2);
    const quizId2 = quizobj2.quizId;
    const quizId1 = quizobj1.quizId;
    expect(adminQuizInfo(authUser2.authUserId, quizId1)).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    expect(adminQuizInfo(authUser1.authUserId, quizId2)).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
  });
  test('Matching correct info', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'test1';
    const description = 'testing';
    const IDobj = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizInfo(authUser.authUserId, IDobj.quizId)).toStrictEqual({
      quizId: IDobj.quizId, name: 'test1', timeCreated: format(new Date(), 'MMMM d, yyyy h:mm a'), timeLastEdited: format(new Date(), 'MMMM d, yyyy h:mm a'), description: 'testing'
    });
  });
});

describe('Testing QuizNameUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for AuthuserId is not a valid user
  test('invalid user id', () => {
    const authUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'BdDhK';
    const name2 = 'sami';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(authUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(authUser.authUserId + 1, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The user id is not valid.' });
  });

  // Testing for QuizId validity
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const description = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId + 1, name);
    expect(Update).toStrictEqual({ error: 'The quiz id is not valid.' });
  });

  // Testing for quiz ownership
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const autherUser1 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque');
    const name = 'sami';
    const description = 'test1';
    const name2 = 'Tumi';
    const name3 = 'Amra';
    const description2 = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const QuizCrt2 = adminQuizCreate(autherUser1.authUserId, name2, description2);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt2.quizId, name3);
    expect(Update).toStrictEqual({ error: 'Quiz belongs to a different user.' });
  });

  // Testing for name is not alphanumeric
  test('invalid name', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'BdDhk!@#?/iter1< ';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is not valid.' });
  });

  // Testing for name is too short
  test('short name', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'hi';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is either too long or too short.' });
  });

  // Testing for name is too long
  test('long name', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'hhhheeeeeeeeeeelllllllllllllllloooooooooooooooooo';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is either too long or too short.' });
  });

  // Testing for invalid name input
  test('name is empty', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = '';
    const description = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The name is either too long or too short.' });
  });

  // Testing for if the name is used by other user
  test('name is used', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'ami';
    const description = 'test2';
    const description2 = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const QuizCrt2 = adminQuizCreate(autherUser.authUserId, name2, description2);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({ error: 'The quiz name is already been used.' });
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const name2 = 'ami';
    const description = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizNameUpdate(autherUser.authUserId, QuizCrt.quizId, name2);
    expect(Update).toStrictEqual({});
  });
});

describe('Testing QuizDescriptionUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Testing for AuthuserId is not a valid user
  test('invalid user id', () => {
    const authUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'BdDhK';
    const description = 'test2';
    const description2 = 'test1';
    const QuizCrt = adminQuizCreate(authUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(authUser.authUserId + 1, QuizCrt.quizId, description2);
    expect(Update).toStrictEqual({ error: 'The user id is not valid.' });
  });

  // Testing for QuizId validity
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const description = 'test1';
    const description2 = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt.quizId + 1, description2);
    expect(Update).toStrictEqual({ error: 'The quiz id is not valid.' });
  });

  // Testing for quiz ownership
  test('QuizId does not belong to user', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const autherUser1 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque');
    const name = 'sami';
    const description = 'test1';
    const name2 = 'ami';
    const description2 = 'test2';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const QuizCrt2 = adminQuizCreate(autherUser1.authUserId, name2, description2);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt2.quizId, description2);
    expect(Update).toStrictEqual({ error: 'Quiz belongs to a different user.' });
  });

  // Testing for too long description
  test('long description', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'BdDhk';
    const description = 'test2';
    const description2 = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt.quizId, description2);
    expect(Update).toStrictEqual({ error: 'The description is too long.' });
  });

  // Testing for correct input and output
  test('Correct input', () => {
    const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
    const name = 'sami';
    const description = 'test2';
    const description2 = 'test1';
    const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
    const Update = adminQuizDescriptionUpdate(autherUser.authUserId, QuizCrt.quizId, description2);
    expect(Update).toStrictEqual({});
  });
});
*/
