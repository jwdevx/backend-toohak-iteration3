import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  //   adminUserPasswordUpdate,
  adminAuthLogout,
  clear
} from './apiRequests';

const ERROR = { error: expect.any(String) };
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
// const FORBIDDEN = 403;
// const NOT_FOUND = 404;

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
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionId = Number(decodeURIComponent(res.bodyObj.token));
    expect(sessionId).not.toBeNaN();
  });

  test(' 400 check for duplicate existing email', () => {
    adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
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
    const NameFirst2 = adminAuthRegister(
      'hayden2.smith@unsw.edu.au', '1234abcd', 'Haydenhaydenhaydenhayden', 'Smith');
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
    const NameLast2 = adminAuthRegister(
      'hayden2@gmail.com', '1234abcd', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast1.statusCode).toStrictEqual(BAD_REQUEST);
    expect(NameLast1.bodyObj).toStrictEqual({
      error: 'Last name must be between 2 and 20 characters long'
    });
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

  test('Check error message for Password not contain at one number and one letter', () => {
    const Pass1 = adminAuthRegister('hayden1@gmail.com', '12341234', 'Hayden', 'Smith');
    const Pass2 = adminAuthRegister('hayden2@gmail.com', 'abcdabcd', 'Hayden', 'Smith');
    expect(Pass1.statusCode).toStrictEqual(BAD_REQUEST);
    expect(Pass1.bodyObj).toStrictEqual({
      error: 'Password must contain at least one letter and one number'
    });
    expect(Pass2.bodyObj).toStrictEqual(ERROR);
  });
});

// =============================================================================
// ============================= adminAuthLogin ================================
// =============================================================================
describe('Test for adminAuthLogin', () => {
  beforeEach(() => {
    clear();
  });

  test('200 check successful registration', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });

    const loginRes = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd');
    expect(loginRes.statusCode).toStrictEqual(OK);
    expect(loginRes.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionId = Number(decodeURIComponent(loginRes.bodyObj.token));
    expect(sessionId).not.toBeNaN();
  });

  test(' 400 check for missing email', () => {
    const res = adminAuthLogin('', '1234abcd');
    expect(res.bodyObj).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test(' 400 check for missing password', () => {
    const res = adminAuthLogin('email@gmail.com', '');
    expect(res.bodyObj).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test(' 400 email does not exist ', () => {
    const res = adminAuthLogin('nonexistentemail@gmail.com', 'non_existent_Account');
    expect(res.bodyObj).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(BAD_REQUEST);
  });

  test(' 400 wrong password right email', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });
    const loginRes = adminAuthLogin('hayden.smith@unsw.edu.au', 'wrongpassword');
    expect(loginRes.statusCode).toStrictEqual(BAD_REQUEST);
    expect(loginRes.bodyObj).toStrictEqual({ error: expect.any(String) });
  });

  test('400 Null argument', () => {
    const loginRes = adminAuthLogin('', '');
    expect(loginRes.statusCode).toStrictEqual(BAD_REQUEST);
    expect(loginRes.bodyObj).toStrictEqual({ error: expect.any(String) });
  });
});

// =============================================================================
// ============================ adminUserDetails ===============================
// =============================================================================
describe('Test for adminUserDetails', () => {
  beforeEach(() => {
    clear();
  });

  test('200 Success case', () => {
    const register = adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetails(register.bodyObj.token);
    expect(result.statusCode).toBe(OK);
    expect(result.bodyObj).toEqual({
      response: {
        user: {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden2@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0
        },
      }
    });
  });

  test('401 Error case: Empty token', () => {
    adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetails('');
    expect(result.statusCode).toBe(UNAUTHORIZED);
    expect(result.bodyObj).toEqual({ error: expect.any(String) });
  });
  test('401 Error case: invalid token', () => {
    adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetails('9999999999');
    expect(result.statusCode).toBe(UNAUTHORIZED);
    expect(result.bodyObj).toEqual({ error: expect.any(String) });
  });
});
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

    const retVal = adminUserDetailsUpdate(
      res.bodyObj.token, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(200);
    expect(retVal.bodyObj).toStrictEqual({});

    const userDetailsRes = adminUserDetails(res.bodyObj.token);
    expect(userDetailsRes.statusCode).toBe(200);
    expect(userDetailsRes.bodyObj).toStrictEqual({
      response: {
        user: {
          userId: 1,
          name: 'Angelina Jolie',
          email: 'smith.hayden@unsw.edu.au',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        },
      }
    });
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
    expect(retVal3.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });
  });

  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    const retVal = adminUserDetailsUpdate('6', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(401);
    expect(retVal.bodyObj).toStrictEqual({
      error: 'Token is invalid (does not refer to valid logged in user session)'
    });
  });

  test('Check error message if email is currently used by another user', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    const retVal = adminUserDetailsUpdate(
      user1.bodyObj.token, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift');
    expect(retVal.statusCode).toStrictEqual(BAD_REQUEST);
    expect(retVal.bodyObj).toStrictEqual({
      error: 'Email is currently used by another user, choose another email!'
    });
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
    expect(email5.bodyObj).toStrictEqual({ error: 'Invalid email address: email is not a string' });
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
    const NameFirst2 = adminUserDetailsUpdate(
      user1.bodyObj.token, 'hayden2@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith');
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
    const NameLast2 = adminUserDetailsUpdate(
      user1.bodyObj.token, 'hayden8@gmail.com', 'Hayden', 'Smithsmithsmithsmithsmith');
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

// =============================================================================
// ============================= adminAuthLogout ===============================
// =============================================================================

describe('Test for adminAuthLogout', () => {
  beforeEach(() => {
    clear();
  });

  test('Test Combined', () => {
    // Register Hayden
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });

    // Success Login
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd');
    expect(login.statusCode).toStrictEqual(OK);
    expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });

    // Error Logout Test Start Here
    const logout1 = adminAuthLogout('');
    expect(logout1.statusCode).toBe(401);
    expect(logout1.bodyObj).toStrictEqual({ error: 'Token is empty or not provided' });

    const logout2 = adminAuthLogout('8');
    expect(logout2.statusCode).toBe(401);
    expect(logout2.bodyObj).toStrictEqual({
      error: 'Token is invalid (does not refer to valid logged in user session)'
    });

    // Success Logout Test Start Here
    const logout3 = adminAuthLogout(res.bodyObj.token);
    expect(logout3.statusCode).toBe(200);
    expect(logout3.bodyObj).toStrictEqual({ });

    const userDetails = adminUserDetails(res.bodyObj.token);
    expect(userDetails.statusCode).toBe(401);
    expect(userDetails.bodyObj).toStrictEqual({
      error: 'Token is invalid (does not refer to valid logged in user session)'
    });
  });
});
