/* eslint-disable */
// @ts-nocheck
//TODO REMOVE THIS 2 COMMENTS ABOVE when this file is lintsafe and typesafe

/*

There is this 3  number of errors in typecheck in this file:
	3  src/auth.test.ts:55

Please run:
	npm test
	npm run lint
	npm run tsc

/import/ravel/5/z5494973/comp1531/project-backend/src/auth.test.ts
    2:1   error  Too many blank lines at the beginning of file. Max of 1 allowed  no-multiple-empty-lines
   19:5   error  'ExampleUser' is assigned a value but never used                 @typescript-eslint/no-unused-vars
   20:5   error  'ExampleUser2' is assigned a value but never used                @typescript-eslint/no-unused-vars
   68:11  error  'UserId' is assigned a value but never used                      @typescript-eslint/no-unused-vars
  198:11  error  'user1' is assigned a value but never used                       @typescript-eslint/no-unused-vars
  205:11  error  'user2' is assigned a value but never used                       @typescript-eslint/no-unused-vars
  216:11  error  'email5' is assigned a value but never used                      @typescript-eslint/no-unused-vars
325: 11  error  'error' is assigned a value but never used @typescript-eslint / no - unused - vars

*/
//TODO REMOVE ALL COMMENTS ABOVE ----------------------------------------------

import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout,  
  clear
} from './apiRequests';

const ERROR = { error: expect.any(String) };
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

beforeEach(() => {
  clear();
});

// =============================================================================
// ========================== adminAuthRegister ================================
// =============================================================================

describe('Test for adminAuthRegister', () => {
  beforeEach(() => {
    clear();
  });

  test('200 check successful registration', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');

    expect(res.statusCode).toStrictEqual(OK);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String)});    

    const sessionId = Number(decodeURIComponent(res.bodyObj.token));
    expect(sessionId).not.toBeNaN();
  });

  test(' 400 check for duplicate existing email', () => {
    const UserId = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.bodyObj).toStrictEqual({ error: 'Email address is used by another user' });
    expect(res.statusCode).toStrictEqual(BAD_REQUEST);
   
  });

  test.each([
    ['invalid_email', '1234abcd', 'Hayden', 'Smith'],
    ['email.com', '1234abcd', 'Hayden', 'Smith'],
    ['email@', '1234abcd', 'Hayden', 'Smith'],
    ['email@hayden', '1234abcd', 'Hayden', 'Smith'],
    ['hayden@@gmail.com', '1234abcd', 'Hayden', 'Smith'],
    ['hay?den@[192.168.1.1]', '1234abcd', 'Hayden', 'Smith']
  ])('("%s") does not satify validator.isEmail function', (email, password, nameFirst, nameLast) => {
    const res = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(res.bodyObj).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(res.statusCode).toStrictEqual(BAD_REQUEST);    
  });

  test('Check error message for invalid characters on NameFirst', () => {
    const NameFirst1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'Ha*yden', 'Smith');
    const NameFirst2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden7', 'Smith');
    const NameFirst3 = adminAuthRegister('hayden3.smith@unsw.edu.au', '1234abcd', 'Hayden&Smith', 'Smith');
    const NameFirst4 = adminAuthRegister('hayden4.smith@unsw.edu.au', '1234abcd', 'H@yden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(BAD_REQUEST);
    expect(NameFirst1.bodyObj).toStrictEqual({ error: 'First name contains invalid characters' });
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst3.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst4.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const NameFirst1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'H', 'Smith');
    const NameFirst2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Haydenhaydenhaydenhayden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(BAD_REQUEST);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for invalid characters on NameLast', () => {
    const NameLast1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm_ith');
    const NameLast2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm*ith');
    const NameLast3 = adminAuthRegister('hayden3.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith3');
    const NameLast4 = adminAuthRegister('hayden4.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm!th');
    expect(NameLast1.statusCode).toStrictEqual(BAD_REQUEST);    
    expect(NameLast1.bodyObj).toStrictEqual({ error: 'Last name contains invalid characters' });
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
    expect(NameLast3.bodyObj).toStrictEqual(ERROR);
    expect(NameLast4.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    const NameLast1 = adminAuthRegister('hayden1@gmail.com', '1234abcd', 'Hayden', 's');
    const NameLast2 = adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast1.statusCode).toStrictEqual(BAD_REQUEST);    
    expect(NameLast1.bodyObj).toStrictEqual({ error: 'Last name must be between 2 and 20 characters long' });
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for Password is less than 8 characters', () => {
    const Pass1 = adminAuthRegister('hayden1@gmail.com', '1', 'Hayden', 'Smith');
    const Pass2 = adminAuthRegister('hayden2@gmail.com', '1234', 'Hayden', 'Smith');
    const Pass3 = adminAuthRegister('hayden3@gmail.com', 'abcd', 'Hayden', 'Smith');
    const Pass4 = adminAuthRegister('hayden4@gmail.com', '123abcd', 'Hayden', 'Smith');
    expect(Pass1.statusCode).toStrictEqual(BAD_REQUEST);       
    expect(Pass1.bodyObj).toStrictEqual({ error: 'Password must be at least 8 characters long' });
    expect(Pass2.bodyObj).toStrictEqual(ERROR);
    expect(Pass3.bodyObj).toStrictEqual(ERROR);
    expect(Pass4.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for Password does not contain at least one number and at least one letter', () => {
    const Pass1 = adminAuthRegister('hayden1@gmail.com', '12341234', 'Hayden', 'Smith');
    const Pass2 = adminAuthRegister('hayden2@gmail.com', 'abcdabcd', 'Hayden', 'Smith');
    expect(Pass1.statusCode).toStrictEqual(BAD_REQUEST);  
    expect(Pass1.bodyObj).toStrictEqual({ error: 'Password must contain at least one letter and one number' });
    expect(Pass2.bodyObj).toStrictEqual(ERROR);
  });

});


// =============================================================================
// ============================= adminAuthLogin ================================
// =============================================================================

/*

describe('These are tests for adminAuthLogin', () => {
let ExampleUser;
let ExampleUser2;

  beforeEach(() => {
    ExampleUser = adminAuthRegister('samsmith@gmail.com', 'IS1234567', 'Sam', 'Smith');
    ExampleUser2 = adminAuthRegister('kingjakerulesdaworld1@gmail.com', '1234567', 'jamie', 'cheong');
  });

  // NON EXISTENT EMAIL
  test('Error Case: Email address does not exist', () => {
    expect(adminAuthLogin('notemail@gmail.com', '123456')).toStrictEqual({ error: expect.any(String) });
  });

  // WRONG PWD
  test('Error Case: Password is not correct for given email', () => {
    expect(adminAuthLogin('samsmith@gmail.com', '1234567')).toStrictEqual({ error: expect.any(String) });
  });

  // NULL CASE
  test('Error Case: Null argument', () => {
    expect(adminAuthLogin()).toStrictEqual({ error: expect.any(String) });
  });

  // SUCCESS CASE
  test('Success case: Prints user ID', () => {
    expect(adminAuthLogin('samsmith@gmail.com', 'IS1234567')).toStrictEqual({ authUserId: expect.any(Number) });
  });
});
*/

// =============================================================================
// ============================ adminUserDetails ===============================
// =============================================================================

/*
describe('These are tests for adminUserDetails', () => {
  beforeEach(() => {
    clear();
  });
  test('Edge Case: Invalud authUserId', () => {
    expect(adminUserDetails('256')).toStrictEqual({ error: expect.any(String) });
  });

  test('Edge Case: Empty authUserId', () => {
    expect(adminUserDetails('')).toStrictEqual({ error: expect.any(String) });
  });

  test('Success Case: Fetch user details', () => {
    // 1. Use adminAuthRegister to create a user and get the authUserId
    const registrationResult = adminAuthRegister('test@example.com', 'ValidPassword1', 'Johnny', 'Depp');

    // 2. Check if the registration was successful (no error)
    expect(registrationResult).not.toHaveProperty('error');
    const authUserId = registrationResult.authUserId;

    // 3. Use adminUserDetails to fetch user details using the authUserId
    const userDetails = adminUserDetails(authUserId);

    // 4. Assert that user details are as expected
    expect(userDetails).toEqual({
      user: {
        userId: authUserId,
        name: 'Johnny Depp',
        email: 'test@example.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: expect.any(Number),
      }
    });
  });

});
*/  

// =============================================================================
// =========================== adminUserDetailsUpdate ==========================
// =============================================================================

 
describe('Test for adminUserDetailsUpdate', () => {
  beforeEach(() => {
    clear();
  });

  
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
         
    const retVal = adminUserDetailsUpdate(res.bodyObj.token, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(200);
    expect(retVal.bodyObj).toStrictEqual({});

    //TODO uncomment once adminUserDetails is implemented  
    // const userDetailsRes = adminUserDetails(res.bodyObj.token);
    // expect(userDetailsRes.statusCode).toBe(200);
    // expect(userDetailsRes.BodyObj).toStrictEqual({
    //   user: {
    //     userId: res.authUserId,
    //     name: 'Angelina Jolie',
    //     email: 'smith.hayden@unsw.edu.au',
    //     numSuccessfulLogins: expect.any(Number),
    //     numFailedPasswordsSinceLastLogin: expect.any(Number),
    //   }
    // });
  });
   
  test('Token is empty or not provided', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    const retVal1 = adminUserDetailsUpdate(null, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    const retVal2 = adminUserDetailsUpdate(undefined, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    const retVal3 = adminUserDetailsUpdate('', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal1.statusCode).toStrictEqual(401);
    expect(retVal1.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });
    expect(retVal2.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });
    expect(retVal3.bodyObj).toStrictEqual({ error: 'Token is empty or not provided'});
  });
    
  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    const retVal = adminUserDetailsUpdate('6', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(401);
    expect(retVal.bodyObj).toStrictEqual({error: 'Token is invalid (does not refer to valid logged in user session)'});
  });    

  test('Check error message if email is currently used by another user', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const user2 = adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    const retVal = adminUserDetailsUpdate(user1.bodyObj.token, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift');
    expect(retVal.statusCode).toStrictEqual(BAD_REQUEST);
    expect(retVal.bodyObj).toStrictEqual({ error: 'Email is currently used by another user, choose another email!' });
  });

  test('Check error message if email to update is not valid', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const email1 = adminUserDetailsUpdate(user1.bodyObj.token, 'invalid_email', 'Hayden', 'Smith');
    const email2 = adminUserDetailsUpdate(user1.bodyObj.token, 'email.com', 'Hayden', 'Smith');
    const email3 = adminUserDetailsUpdate(user1.bodyObj.token, 'email@', 'Hayden', 'Smith');
    const email4 = adminUserDetailsUpdate(user1.bodyObj.token, 'email@hayden', 'Hayden', 'Smith');
    const email5 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@@gmail.com', 'Hayden', 'Smith');
    expect(email1.statusCode).toStrictEqual(BAD_REQUEST);
    expect(email1.bodyObj).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(email2.bodyObj).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(email3.bodyObj).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(email4.bodyObj).toStrictEqual({ error: 'Invalid email address: email is not a string' });
  });

  test('Check error message for invalid characters on NameFirst', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'Ha*yden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(BAD_REQUEST);    
    expect(NameFirst1.bodyObj).toStrictEqual({ error: 'First name contains invalid characters' });    
    const NameFirst2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'Hayden7', 'Smith');
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);    
    const NameFirst3 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'Hayden&Smith', 'Smith');
    expect(NameFirst3.bodyObj).toStrictEqual(ERROR);        
    const NameFirst4 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'H@yden', 'Smith');
    expect(NameFirst4.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden1@gmail.com', 'H', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(BAD_REQUEST);    
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);    
    const NameFirst2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden2@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith');
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for invalid characters on NameLast', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden3@gmail.com', 'Hayden', 'Sm_ith');
    expect(NameLast1.statusCode).toStrictEqual(BAD_REQUEST);    
    expect(NameLast1.bodyObj).toStrictEqual({ error: 'Last name contains invalid characters' });    
    const NameLast2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden4@gmail.com', 'Hayden', 'Sm*ith');
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
    const NameLast3 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden5@gmail.com', 'Hayden', 'Smith3');
    expect(NameLast3.bodyObj).toStrictEqual(ERROR);    
    const NameLast4 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden6@gmail.com', 'Hayden', 'Sm!th');
    expect(NameLast4.bodyObj).toStrictEqual(ERROR);
  });

  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden7@gmail.com', 'Hayden', 's');
    expect(NameLast1.statusCode).toStrictEqual(BAD_REQUEST);
    expect(NameLast1.bodyObj).toStrictEqual({ error: 'Last name must be between 2 and 20 characters long' });    
    const NameLast2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden8@gmail.com', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
  });


  
});


// =============================================================================
// ========================== adminUserPasswordUpdate ==========================
// =============================================================================
/*
describe('adminUserPasswordUpdate', () => {
  beforeEach(() => {
    clear();
  });
  test('the authId does not exist', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId + 1, '1234abcd', 'WOjiaoZC1');
    expect(error).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });
  test('the old password is wrong', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234aaaa', 'WOjiaoZC1');
    expect(error).toStrictEqual({ error: 'The old password is wrong.' });
  });
  test('the new password is the same as the old one', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', '1234abcd');
    expect(error).toStrictEqual({ error: 'The new password is the same as the old password.' });
  });
  test('the new password is used before', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'WOjiaoZC123');
    const error = adminUserPasswordUpdate(user1.authUserId, 'WOjiaoZC123', '1234abcd');
    expect(error).toStrictEqual({ error: 'The new password is used before.' });
  });
  test('short password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', '1234a');
    expect(error).toStrictEqual({ error: 'Password must be at least 8 characters long' });
  });
  test('missing number password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'abncdefgh');
    expect(error).toStrictEqual({ error: 'Password must contain at least one letter and one number' });
  });
  test('missing letter password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', '12345678');
    expect(error).toStrictEqual({ error: 'Password must contain at least one letter and one number' });
  });
  test('correct input', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'WOjiaoZC123');
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', 'WOjiaoZC123');
    expect(login).toStrictEqual(user1);
  });
});
*/
