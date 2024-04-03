test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});
import {
  adminAuthRegister,
  // adminAuthLogin,
  adminUserDetailsV2,
  // adminUserDetailsUpdateV2,
  // adminUserPasswordUpdateV2,
  // adminAuthLogoutV2,
  clear,
} from './apiRequests';
const ERROR = { error: expect.any(String) };
beforeEach(() => {
  clear();
});

// =============================================================================
// ============================ adminUserDetailsV2 ===============================
// =============================================================================
describe('Test for adminUserDetailsV2', () => {
  beforeEach(() => {
    clear();
  });
  test('200 Success case', () => {
    const register = adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetailsV2(register.bodyObj.token);
    expect(result.statusCode).toBe(200);
    expect(result.bodyObj).toEqual({
      user: {
        userId: expect.any(Number),
        name: 'Hayden Smith',
        email: 'hayden2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      },
    });
  });
  test('401 Error case: Empty token', () => {
    adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetailsV2('');
    expect(result.statusCode).toBe(401);
    expect(result.bodyObj).toEqual(ERROR);
  });
  test('401 Error case: invalid token', () => {
    adminAuthRegister('hayden2@gmail.com', '1234abcd', 'Hayden', 'Smith');
    const result = adminUserDetailsV2('9999999999');
    expect(result.statusCode).toBe(401);
    expect(result.bodyObj).toEqual(ERROR);
  });
});

/*
// =============================================================================
// =========================== adminUserDetailsUpdateV2 ==========================
// =============================================================================

describe('Test for adminUserDetailsUpdateV2', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);

    const retVal = adminUserDetailsUpdateV2(res.bodyObj.token, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(200);
    expect(retVal.bodyObj).toStrictEqual({});

    const userDetailsRes = adminUserDetailsV2(res.bodyObj.token);
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
    const retVal1 = adminUserDetailsUpdateV2(null, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    const retVal2 = adminUserDetailsUpdateV2(undefined, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    const retVal3 = adminUserDetailsUpdateV2('', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
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
    const retVal = adminUserDetailsUpdateV2(res.bodyObj.token + 1, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.statusCode).toStrictEqual(401);
    expect(retVal.bodyObj).toStrictEqual(ERROR);
  });

  // Error 400
  test('Check error message if email is currently used by another user', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    const retVal = adminUserDetailsUpdateV2(user1.bodyObj.token, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift');
    expect(retVal.statusCode).toStrictEqual(400);
    expect(retVal.bodyObj).toStrictEqual(ERROR);
  });
  test('Missing parameters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const email1 = adminUserDetailsUpdateV2(user1.bodyObj.token, '  ', 'Hayden', 'Smith');
    const email2 = adminUserDetailsUpdateV2(user1.bodyObj.token, '1234abcd', '', 'Smith');
    const email3 = adminUserDetailsUpdateV2(user1.bodyObj.token, '1234abcd', 'Hayden', '');
    expect(email1.statusCode).toStrictEqual(400);
    expect(email1.bodyObj).toStrictEqual(ERROR);
    expect(email2.statusCode).toStrictEqual(400);
    expect(email2.bodyObj).toStrictEqual(ERROR);
    expect(email3.statusCode).toStrictEqual(400);
    expect(email3.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message if email to update is not valid', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const email1 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'invalid_email', 'Hayden', 'Smith');
    const email2 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'email.com', 'Hayden', 'Smith');
    const email3 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'email@', 'Hayden', 'Smith');
    const email4 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'email@hayden', 'Hayden', 'Smith');
    const email5 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden@@gmail.com', 'Hayden', 'Smith');
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
    const NameFirst1 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden@gmail.com', 'Ha*yden', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(400);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    const NameFirst2 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden@gmail.com', 'Hayden7', 'Smith');
    expect(NameFirst2.statusCode).toStrictEqual(400);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
    const NameFirst3 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden@gmail.com', 'Hayden&Smith', 'Smith');
    expect(NameFirst3.statusCode).toStrictEqual(400);
    expect(NameFirst3.bodyObj).toStrictEqual(ERROR);
    const NameFirst4 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden@gmail.com', 'H@yden', 'Smith');
    expect(NameFirst4.statusCode).toStrictEqual(400);
    expect(NameFirst4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden1@gmail.com', 'H', 'Smith');
    expect(NameFirst1.statusCode).toStrictEqual(400);
    expect(NameFirst1.bodyObj).toStrictEqual(ERROR);
    const NameFirst2 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden2@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith');
    expect(NameFirst2.statusCode).toStrictEqual(400);
    expect(NameFirst2.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for invalid characters on NameLast', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden3@gmail.com', 'Hayden', 'Sm_ith');
    expect(NameLast1.statusCode).toStrictEqual(400);
    expect(NameLast1.bodyObj).toStrictEqual(ERROR);
    const NameLast2 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden4@gmail.com', 'Hayden', 'Sm*ith');
    expect(NameLast2.statusCode).toStrictEqual(400);
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
    const NameLast3 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden5@gmail.com', 'Hayden', 'Smith3');
    expect(NameLast3.statusCode).toStrictEqual(400);
    expect(NameLast3.bodyObj).toStrictEqual(ERROR);
    const NameLast4 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden6@gmail.com', 'Hayden', 'Sm!th');
    expect(NameLast4.statusCode).toStrictEqual(400);
    expect(NameLast4.bodyObj).toStrictEqual(ERROR);
  });
  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden7@gmail.com', 'Hayden', 's');
    expect(NameLast1.statusCode).toStrictEqual(400);
    expect(NameLast1.bodyObj).toStrictEqual(ERROR);
    const NameLast2 = adminUserDetailsUpdateV2(user1.bodyObj.token, 'hayden8@gmail.com', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast2.statusCode).toStrictEqual(400);
    expect(NameLast2.bodyObj).toStrictEqual(ERROR);
  });
});

// =============================================================================
// ========================== adminUserPasswordUpdateV2 ==========================
// =============================================================================
describe('adminUserPasswordUpdateV2', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Success Case', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const success = adminUserPasswordUpdateV2(user1.bodyObj.token, '1234abcd', 'WOjiaoZC123');
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', 'WOjiaoZC123');
    expect(login.statusCode).toStrictEqual(200);
    expect(login.bodyObj).toStrictEqual({ token: expect.any(String) });
    expect(success.statusCode).toStrictEqual(200);
    expect(success.bodyObj).toStrictEqual({});
  });
  // Error 401
  test('the token does not exist', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token + 1, '1234abcd', 'WOjiaoZC1');
    expect(error.statusCode).toBe(401);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('the token is invalid', () => {
    const error = adminUserPasswordUpdateV2('', '1234abcd', 'WOjiaoZC1');
    expect(error.statusCode).toBe(401);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  // Error 400
  test('missing parameter', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj.token;
    const error = adminUserPasswordUpdateV2(user1, '', 'WOjiaoZC1');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);

    const user2 = adminAuthRegister('hayden.mith@unsw.edu.au', '1234abcd', 'Hayde', 'mith').bodyObj.token;
    const error1 = adminUserPasswordUpdateV2(user2, '1234abcd', '');
    expect(error1.statusCode).toBe(400);
    expect(error1.bodyObj).toStrictEqual(ERROR);
  });
  test('the old password is wrong', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token, '1234aaaa', 'WOjiaoZC1');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('the new password is the same as the old one', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token, '1234abcd', '1234abcd');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('the new password is used before', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminUserPasswordUpdateV2(user1.bodyObj.token, '1234abcd', 'WOjiaoZC123');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token, 'WOjiaoZC123', '1234abcd');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('short password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token, '1234abcd', '1234a');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('missing number password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token, '1234abcd', 'abncdefgh');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
  test('missing letter password', () => {
    const user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdateV2(user1.bodyObj.token, '1234abcd', '12345678');
    expect(error.statusCode).toBe(400);
    expect(error.bodyObj).toStrictEqual(ERROR);
  });
});

// =============================================================================
// ============================= adminAuthLogoutV2 ===============================
// =============================================================================

describe('Test for adminAuthLogoutV2', () => {
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
    const logout1 = adminAuthLogoutV2('');
    expect(logout1.statusCode).toBe(401);
    expect(logout1.bodyObj).toStrictEqual(ERROR);

    const logout2 = adminAuthLogoutV2(res.bodyObj.token + 1);
    expect(logout2.statusCode).toBe(401);
    expect(logout2.bodyObj).toStrictEqual(ERROR);

    // Success Logout Test Start Here
    const logout3 = adminAuthLogoutV2(res.bodyObj.token);
    expect(logout3.statusCode).toBe(200);
    expect(logout3.bodyObj).toStrictEqual({});

    // Error 401 since we already logout
    const userDetails = adminUserDetailsV2(res.bodyObj.token);
    expect(userDetails.statusCode).toBe(401);
    expect(userDetails.bodyObj).toStrictEqual(ERROR);
  });
});
*/
