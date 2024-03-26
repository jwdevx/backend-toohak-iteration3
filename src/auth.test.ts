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
  // Success 200
  test('200 check successful registration', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionId = Number(decodeURIComponent(res.bodyObj.token));
    expect(sessionId).not.toBeNaN();
  });
  // Error 400
  test('400 - Null or emptystring', () => {
    let user1 = adminAuthRegister('', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    expect(user1.bodyObj).toStrictEqual(ERROR);

    user1 = adminAuthRegister('     ', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    expect(user1.bodyObj).toStrictEqual(ERROR);

    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    expect(user1.bodyObj).toStrictEqual(ERROR);

    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', '', 'Smith');
    expect(user1.statusCode).toStrictEqual(400);
    expect(user1.bodyObj).toStrictEqual(ERROR);

    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', '');
    expect(user1.statusCode).toStrictEqual(400);
    expect(user1.bodyObj).toStrictEqual(ERROR);

    user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(user1.statusCode).toStrictEqual(200);
    const user1SessionId1String = user1.bodyObj.token;
    expect(user1.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionIdNumber = Number(decodeURIComponent(user1SessionId1String));
    expect(sessionIdNumber).not.toBeNaN();
  });
  test(' 400 check for duplicate existing email', () => {
    adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.bodyObj).toStrictEqual(ERROR);
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
    expect(res.statusCode).toStrictEqual(400);
    expect(res.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for invalid characters on NameFirst', () => {
    const NameFirst1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'Ha*yden', 'Smith');
    const NameFirst2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden7', 'Smith');
    const NameFirst3 = adminAuthRegister('hayden3.smith@unsw.edu.au', '1234abcd', 'Hayden&Smith', 'Smith');
    const NameFirst4 = adminAuthRegister('hayden4.smith@unsw.edu.au', '1234abcd', 'H@yden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(400);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst2.statusCode).toStrictEqual(400);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst3.statusCode).toStrictEqual(400);
    expect(NameFirst3.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst4.statusCode).toStrictEqual(400);
    expect(NameFirst4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const NameFirst1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'H', 'Smith');
    const NameFirst2 = adminAuthRegister(
      'hayden2.smith@unsw.edu.au', '1234abcd', 'Haydenhaydenhaydenhayden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(400);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    expect(NameFirst2.statusCode).toStrictEqual(400);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for invalid characters on NameLast', () => {
    const NameLast1 = adminAuthRegister('hayden1.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm_ith');
    const NameLast2 = adminAuthRegister('hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm*ith');
    const NameLast3 = adminAuthRegister('hayden3.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith3');
    const NameLast4 = adminAuthRegister('hayden4.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm!th');
    expect(NameLast1.statusCode).toStrictEqual(400);
    expect(NameLast1.bodyObj).toStrictEqual(ERROR);
    expect(NameLast2.statusCode).toStrictEqual(400);
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
    expect(NameLast3.statusCode).toStrictEqual(400);
    expect(NameLast3.bodyObj).toStrictEqual(ERROR);
    expect(NameLast4.statusCode).toStrictEqual(400);
    expect(NameLast4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    const NameLast1 = adminAuthRegister('hayden1@gmail.com', '1234abcd', 'Hayden', 's');
    const NameLast2 = adminAuthRegister(
      'hayden2@gmail.com', '1234abcd', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast1.statusCode).toStrictEqual(400);
    expect(NameLast1.bodyObj).toStrictEqual(ERROR);
    expect(NameLast2.statusCode).toStrictEqual(400);
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for Password is less than 8 characters', () => {
    const Pass1 = adminAuthRegister('hayden1@gmail.com', '1', 'Hayden', 'Smith');
    const Pass2 = adminAuthRegister('hayden2@gmail.com', '1234', 'Hayden', 'Smith');
    const Pass3 = adminAuthRegister('hayden3@gmail.com', 'abcd', 'Hayden', 'Smith');
    const Pass4 = adminAuthRegister('hayden4@gmail.com', '123abcd', 'Hayden', 'Smith');
    expect(Pass1.statusCode).toStrictEqual(400);
    expect(Pass1.bodyObj).toStrictEqual(ERROR);
    expect(Pass2.statusCode).toStrictEqual(400);
    expect(Pass2.bodyObj).toStrictEqual(ERROR);
    expect(Pass3.statusCode).toStrictEqual(400);
    expect(Pass3.bodyObj).toStrictEqual(ERROR);
    expect(Pass4.statusCode).toStrictEqual(400);
    expect(Pass4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for Password not contain at one number and one letter', () => {
    const Pass1 = adminAuthRegister('hayden1@gmail.com', '12341234', 'Hayden', 'Smith');
    const Pass2 = adminAuthRegister('hayden2@gmail.com', 'abcdabcd', 'Hayden', 'Smith');
    expect(Pass1.statusCode).toStrictEqual(400);
    expect(Pass1.bodyObj).toStrictEqual(ERROR);
    expect(Pass2.statusCode).toStrictEqual(400);
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
  // Success 200
  test('200 check successful registration', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });

    const loginRes = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd');
    expect(loginRes.statusCode).toStrictEqual(200);
    expect(loginRes.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionId = Number(decodeURIComponent(loginRes.bodyObj.token));
    expect(sessionId).not.toBeNaN();
  });
  // Error 400
  test(' 400 check for missing email', () => {
    const res = adminAuthLogin('', '1234abcd');
    expect(res.bodyObj).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });
  test(' 400 check for missing password', () => {
    const res = adminAuthLogin('email@gmail.com', '');
    expect(res.bodyObj).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });
  test(' 400 email does not exist ', () => {
    const res = adminAuthLogin('nonexistentemail@gmail.com', 'non_existent_Account');
    expect(res.bodyObj).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });
  test(' 400 wrong password right email', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    const loginRes = adminAuthLogin('hayden.smith@unsw.edu.au', 'wrongpassword');
    expect(loginRes.statusCode).toStrictEqual(400);
    expect(loginRes.bodyObj).toStrictEqual(ERROR);
  });
  test('400 Null argument', () => {
    const loginRes = adminAuthLogin('', '');
    expect(loginRes.statusCode).toStrictEqual(400);
    expect(loginRes.bodyObj).toStrictEqual(ERROR);
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
    expect(result.statusCode).toBe(200);
    expect(result.bodyObj).toEqual({
      user: {
        userId: 1,
        name: 'Hayden Smith',
        email: 'hayden2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      },
    });
  });
  test('401 Error case: Empty token', () => {
    adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetails('');
    expect(result.statusCode).toBe(401);
    expect(result.bodyObj).toEqual(ERROR);
  });
  test('401 Error case: invalid token', () => {
    adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetails('9999999999');
    expect(result.statusCode).toBe(401);
    expect(result.bodyObj).toEqual(ERROR);
  });
});
// =============================================================================
// =========================== adminUserDetailsUpdate ==========================
// =============================================================================

describe('Test for adminUserDetailsUpdate', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);

    const retVal = adminUserDetailsUpdate(res.bodyObj.token, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(200);
    expect(retVal.bodyObj).toStrictEqual({});

    const userDetailsRes = adminUserDetails(res.bodyObj.token);
    expect(userDetailsRes.statusCode).toBe(200);
    expect(userDetailsRes.bodyObj).toStrictEqual({
      user: {
        userId: 1,
        name: 'Angelina Jolie',
        email: 'smith.hayden@unsw.edu.au',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      },
    });
  });
  // Error 401 - 'Token is empty or not provided'
  test('Token is empty or not provided', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    const retVal1 = adminUserDetailsUpdate(null, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    const retVal2 = adminUserDetailsUpdate(undefined, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    const retVal3 = adminUserDetailsUpdate('', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal1.statusCode).toStrictEqual(401);
    expect(retVal1.bodyObj).toStrictEqual(ERROR);
    expect(retVal2.statusCode).toStrictEqual(401);
    expect(retVal2.bodyObj).toStrictEqual(ERROR);
    expect(retVal3.statusCode).toStrictEqual(401);
    expect(retVal3.bodyObj).toStrictEqual(ERROR);
  });
  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    const retVal = adminUserDetailsUpdate(res.bodyObj.token + 1, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(401);
    expect(retVal.bodyObj).toStrictEqual(ERROR);
  });

  // Error 400
  test('Check error message if email is currently used by another user', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    const retVal = adminUserDetailsUpdate(user1.bodyObj.token, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift');
    expect(retVal.statusCode).toStrictEqual(400);
    expect(retVal.bodyObj).toStrictEqual(ERROR);
  });
  test('Missing parameters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const email1 = adminUserDetailsUpdate(user1.bodyObj.token, '  ', 'Hayden', 'Smith');
    const email2 = adminUserDetailsUpdate(user1.bodyObj.token, '1234abcd', '', 'Smith');
    const email3 = adminUserDetailsUpdate(user1.bodyObj.token, '1234abcd', 'Hayden', '');
    expect(email1.statusCode).toStrictEqual(400);
    expect(email1.bodyObj).toStrictEqual(ERROR);
    expect(email2.statusCode).toStrictEqual(400);
    expect(email2.bodyObj).toStrictEqual(ERROR);
    expect(email3.statusCode).toStrictEqual(400);
    expect(email3.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message if email to update is not valid', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const email1 = adminUserDetailsUpdate(user1.bodyObj.token, 'invalid_email', 'Hayden', 'Smith');
    const email2 = adminUserDetailsUpdate(user1.bodyObj.token, 'email.com', 'Hayden', 'Smith');
    const email3 = adminUserDetailsUpdate(user1.bodyObj.token, 'email@', 'Hayden', 'Smith');
    const email4 = adminUserDetailsUpdate(user1.bodyObj.token, 'email@hayden', 'Hayden', 'Smith');
    const email5 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@@gmail.com', 'Hayden', 'Smith');
    expect(email1.statusCode).toStrictEqual(400);
    expect(email1.bodyObj).toStrictEqual(ERROR);
    expect(email2.statusCode).toStrictEqual(400);
    expect(email2.bodyObj).toStrictEqual(ERROR);
    expect(email3.statusCode).toStrictEqual(400);
    expect(email3.bodyObj).toStrictEqual(ERROR);
    expect(email4.statusCode).toStrictEqual(400);
    expect(email4.bodyObj).toStrictEqual(ERROR);
    expect(email5.statusCode).toStrictEqual(400);
    expect(email5.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for invalid characters on NameFirst', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'Ha*yden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(400);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    const NameFirst2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'Hayden7', 'Smith');
    expect(NameFirst2.statusCode).toStrictEqual(400);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
    const NameFirst3 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'Hayden&Smith', 'Smith');
    expect(NameFirst3.statusCode).toStrictEqual(400);
    expect(NameFirst3.bodyObj).toStrictEqual(ERROR);
    const NameFirst4 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden@gmail.com', 'H@yden', 'Smith');
    expect(NameFirst4.statusCode).toStrictEqual(400);
    expect(NameFirst4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden1@gmail.com', 'H', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(400);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    const NameFirst2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden2@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith');
    expect(NameFirst2.statusCode).toStrictEqual(400);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for invalid characters on NameLast', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden3@gmail.com', 'Hayden', 'Sm_ith');
    expect(NameLast1.statusCode).toStrictEqual(400);
    expect(NameLast1.bodyObj).toStrictEqual(ERROR);
    const NameLast2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden4@gmail.com', 'Hayden', 'Sm*ith');
    expect(NameLast2.statusCode).toStrictEqual(400);
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
    const NameLast3 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden5@gmail.com', 'Hayden', 'Smith3');
    expect(NameLast3.statusCode).toStrictEqual(400);
    expect(NameLast3.bodyObj).toStrictEqual(ERROR);
    const NameLast4 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden6@gmail.com', 'Hayden', 'Sm!th');
    expect(NameLast4.statusCode).toStrictEqual(400);
    expect(NameLast4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden7@gmail.com', 'Hayden', 's');
    expect(NameLast1.statusCode).toStrictEqual(400);
    expect(NameLast1.bodyObj).toStrictEqual(ERROR);
    const NameLast2 = adminUserDetailsUpdate(user1.bodyObj.token, 'hayden8@gmail.com', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast2.statusCode).toStrictEqual(400);
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
  });
});

// =============================================================================
// ========================== adminUserPasswordUpdate ==========================
// =============================================================================
describe('adminUserPasswordUpdate', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Success Case', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const success = adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', 'WOjiaoZC123');
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', 'WOjiaoZC123');
    expect(login.statusCode).toStrictEqual(200);
    expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });
    expect(success.statusCode).toStrictEqual(200);
    expect(success.bodyObj).toStrictEqual({});
  });
  // Error 401
  test('the token does not exist', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.bodyObj.token + 1, '1234abcd', 'WOjiaoZC1');
    expect(error.statusCode).toBe(401);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('the token is invalid', () => {
    const error = adminUserPasswordUpdate('', '1234abcd', 'WOjiaoZC1');
    expect(error.statusCode).toBe(401);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  // Error 400
  test('missing parameter', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj.token;
    const error = adminUserPasswordUpdate(user1, '', 'WOjiaoZC1');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);

    const user2 = adminAuthRegister('hayden.mith@unsw.edu.au', '1234abcd', 'Hayde', 'mith').bodyObj.token;
    const error1 = adminUserPasswordUpdate(user2, '1234abcd', '');
    expect(error1.statusCode).toBe(400);
    expect(error1.bodyObj).toStrictEqual(ERROR);
  });
  test('the old password is wrong', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.bodyObj.token, '1234aaaa', 'WOjiaoZC1');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('the new password is the same as the old one', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', '1234abcd');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('the new password is used before', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', 'WOjiaoZC123');
    const error = adminUserPasswordUpdate(user1.bodyObj.token, 'WOjiaoZC123', '1234abcd');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('short password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', '1234a');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('missing number password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', 'abncdefgh');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('missing letter password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.bodyObj.token, '1234abcd', '12345678');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
});

// =============================================================================
// ============================= adminAuthLogout ===============================
// =============================================================================

describe('Test for adminAuthLogout', () => {
  beforeEach(() => {
    clear();
  });

  test('Test Combined', () => {
    // Register Hayden - Session 1
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });

    // Success Login - Session 2
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd');
    expect(login.statusCode).toStrictEqual(200);
    expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });

    // Error 401 Logout Test Start Here
    const logout1 = adminAuthLogout('');
    expect(logout1.statusCode).toBe(401);
    expect(logout1.bodyObj).toStrictEqual(ERROR);

    const logout2 = adminAuthLogout(res.bodyObj.token + 1);
    expect(logout2.statusCode).toBe(401);
    expect(logout2.bodyObj).toStrictEqual(ERROR);

    // Success Logout Test Start Here
    const logout3 = adminAuthLogout(res.bodyObj.token);
    expect(logout3.statusCode).toBe(200);
    expect(logout3.bodyObj).toStrictEqual({});

    // Error 401 since we already logout
    const userDetails = adminUserDetails(res.bodyObj.token);
    expect(userDetails.statusCode).toBe(401);
    expect(userDetails.bodyObj).toStrictEqual(ERROR);
  });
});
