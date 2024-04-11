import HTTPError from 'http-errors';
import { UserCreateReturn, UserDetailsReturn } from './returnInterfaces';
import {
  adminAuthRegister,
  adminUserDetailsV2,
  adminAuthLogoutV2,
  adminUserDetailsUpdateV2,
  adminUserPasswordUpdateV2,
  clear,
} from './apiRequestsIter3';

describe('Test for adminAuthLogoutV2', () => {
  beforeEach(() => {
    clear();
  });
  test('Empty token', () => {
    // Error 401 Logout Test Start Here
    expect(() => adminAuthLogoutV2('')).toThrow(HTTPError[401]);
  });
  test('Empty token', () => {
    expect(() => adminAuthLogoutV2('9999999')).toThrow(HTTPError[401]);
  });
  test('success 200', () => {
    // Register Hayden - Session 1
    const token2 = (adminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').bodyObj as UserCreateReturn).token;
    expect(token2).toStrictEqual(expect.any(String));
    const logout = adminAuthLogoutV2(token2);
    expect(logout.bodyObj).toStrictEqual({});
  });
});
// TODO
// =============================================================================
// ============================ adminUserDetailsV2 ===============================
// =============================================================================
describe('Test for adminUserDetailsV2', () => {
  beforeEach(() => {
    clear();
  });
  test('200 Success case', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const result = adminUserDetailsV2(token1).bodyObj as UserDetailsReturn;
    expect(result).toEqual({
      user: {
        userId: expect.any(Number),
        name: 'Hayden Smith',
        email: 'hayden2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      },
    });
  });
  test(' 400 empty token', () => {
    expect(() => adminUserDetailsV2('')).toThrow(HTTPError[401]);
  });
  test(' 400 invalid token', () => {
    expect(() => adminUserDetailsV2('99999999')).toThrow(HTTPError[401]);
  });
});

// TODO
describe('Test for adminUserDetailsUpdateV2', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const retVal = adminUserDetailsUpdateV2(token1, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.bodyObj).toStrictEqual({});

    const userDetailsRes = adminUserDetailsV2(token1);
    expect(userDetailsRes.bodyObj).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Angelina Jolie',
        email: 'smith.hayden@unsw.edu.au',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      },
    });
  });
  // Error 401 - 'Token is empty or not provided'
  test('Token is empty or not provided', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminUserDetailsUpdateV2(null, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie'))
      .toThrow(HTTPError[401]);
    expect(() => adminUserDetailsUpdateV2(undefined, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie'))
      .toThrow(HTTPError[401]);
    expect(() => adminUserDetailsUpdateV2('', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie'))
      .toThrow(HTTPError[401]);
  });
  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminUserDetailsUpdateV2('99999999', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie')).toThrow(HTTPError[401]);
  });
  // Error 400
  test('Check error message if email is currently used by another user', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    expect(() => adminUserDetailsUpdateV2(token1, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift')).toThrow(HTTPError[400]);
  });
  test('Missing parameters', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminUserDetailsUpdateV2(token1, '  ', 'Hayden', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminUserDetailsUpdateV2(token1, '1234abcd', '', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminUserDetailsUpdateV2(token1, '1234abcd', 'Hayden', '')).toThrow(HTTPError[400]);
  });
  test.each([
    ['invalid_email'],
    ['email.com'],
    ['email@'],
    ['email@hayden'],
    ['hayden@@gmail.com'],
  ])('update email to %s should return 400 error', async (newEmail) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdateV2(token, newEmail, 'Hayden', 'Smith')).toThrow(HTTPError[400]);
  });
  test.each([
    ['Ha*yden'],
    ['Hayden7'],
    ['Hayden&Smith'],
    ['H@yden'],
  ])('Check error message for invalid characters in NameFirst: %s', async (invalidName) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdateV2(token, '1234abcd', invalidName, 'Smith')).toThrow(HTTPError[400]);
  });
  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdateV2(token, 'hayden1@gmail.com', 'H', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminUserDetailsUpdateV2(token, 'hayden2@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith')).toThrow(HTTPError[400]);
  });
  test.each([
    ['Sm_ith'],
    ['Sm*ith'],
    ['Smith3'],
    ['Sm!th'],
  ])('Check error message for invalid characters in NameLast: %s', async (invalidName) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdateV2(token, '1234abcd', 'Hayden', invalidName)).toThrow(HTTPError[400]);
  });
  test.each([
    ['s'],
    ['Smithsmithsmithsmithsmith'],
  ])('Check error message for NameLast length: %s', async (invalidLastName) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdateV2(token, 'hayden7@gmail.com', 'Hayden', invalidLastName)).toThrow(HTTPError[400]);
  });
});

// TODO
// =============================================================================
// ========================== adminUserPasswordUpdateV2 ==========================
// =============================================================================
describe('adminUserPasswordUpdateV2', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Success Case', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const retVal = adminUserPasswordUpdateV2(token1, 'iloveemail1234', 'Angelina1234');
    expect(retVal.bodyObj).toStrictEqual({});
  });
  // Error 401
  test('the token does not exist', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminUserPasswordUpdateV2('999999999', '1234abcd', 'WOjiaoZC1')).toThrow(HTTPError[401]);
  });
  test('the token is invalid', () => {
    expect(() => adminUserPasswordUpdateV2('', '1234abcd', 'WOjiaoZC1')).toThrow(HTTPError[401]);
  });
  // Error 400
  test.each([
    ['hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith', '', 'WOjiaoZC1'],
    ['hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith', '1234abcd', ''],
  ])('Check missing parameter error', async (email, password, firstName, lastName, oldPassword, newPassword) => {
    const token = (adminAuthRegister(email, password, firstName, lastName).bodyObj as UserCreateReturn).token;
    expect(token).toStrictEqual(expect.any(String));
    expect(() => adminUserPasswordUpdateV2(token, oldPassword, newPassword)).toThrow(HTTPError[400]);
  });
  test('the old password is wrong', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserPasswordUpdateV2(token1, '1234aaaa', 'WOjiaoZC1')).toThrow(HTTPError[400]);
  });
  test('the new password is the same as the old one', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserPasswordUpdateV2(token1, '1234abcd', '1234abcd')).toThrow(HTTPError[400]);
  });
  test('the new password is used before', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    adminUserPasswordUpdateV2(token1, 'iloveemail1234', 'WOjiaoC123');
    expect(() => adminUserPasswordUpdateV2(token1, 'WOjiaoC123', 'iloveemail1234')).toThrow(HTTPError[400]);
  });
  test('short password', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserPasswordUpdateV2(token1, '1234abcd', '1234a')).toThrow(HTTPError[400]);
  });
  test('missing number password', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserPasswordUpdateV2(token1, '1234abcd', 'abncdefgh')).toThrow(HTTPError[400]);
  });
  test('missing letter password', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserPasswordUpdateV2(token1, '1234abcd', '12345678')).toThrow(HTTPError[400]);
  });
});

// TODO