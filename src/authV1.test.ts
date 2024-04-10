import HTTPError from 'http-errors';

import {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogout,
  adminUserDetailsUpdate,
  clear,
} from './apiRequestsIter3';
import { UserCreateReturn, UserDetailsReturn } from './returnInterfaces';
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
    const token1 = (adminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
  });
  test('400 - Null or emptystring', () => {
    expect(() => adminAuthRegister('', '1234abcd', 'Hayden', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminAuthRegister('     ', '1234abcd', 'Hayden', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminAuthRegister('hayden.smith@unsw.edu.au', '', 'Hayden', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', '', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', '')).toThrow(HTTPError[400]);
  });
  test(' 400 check for duplicate existing email', () => {
    adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(() => adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith')).toThrow(HTTPError[400]);
  });
  test.each([
    ['invalid_email', '1234abcd', 'Hayden', 'Smith'],
    ['email.com', '1234abcd', 'Hayden', 'Smith'],
    ['email@', '1234abcd', 'Hayden', 'Smith'],
    ['email@hayden', '1234abcd', 'Hayden', 'Smith'],
    ['hayden@@gmail.com', '1234abcd', 'Hayden', 'Smith'],
    ['hay?den@[192.168.1.1]', '1234abcd', 'Hayden', 'Smith']
  ])('("%s") does not satify validator.isEmail function', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
  test.each([
    ['hayden1.smith@unsw.edu.au', '1234abcd', 'Ha*yden', 'Smith'],
    ['hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden7', 'Smith'],
    ['hayden3.smith@unsw.edu.au', '1234abcd', 'Hayden&Smith', 'Smith'],
    ['hayden4.smith@unsw.edu.au', '1234abcd', 'H@yden', 'Smith'],
  ])('Check error message for invalid characters on NameFirst', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
  test.each([
    ['hayden1.smith@unsw.edu.au', '1234abcd', 'H', 'Smith'],
    ['hayden2.smith@unsw.edu.au', '1234abcd', 'Haydenhaydenhaydenhayden', 'Smith'],
  ])('Check error message for NameFirst > 2 || < 20 characters', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
  test.each([
    ['hayden1.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm_ith'],
    ['hayden2.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm*ith'],
    ['hayden3.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith3'],
    ['hayden4.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm!th'],
  ])('Check error message for invalid characters on NameLast', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
  test.each([
    ['hayden1@gmail.com', '1234abcd', 'Hayden', 's'],
    ['hayden2@gmail.com', '1234abcd', 'Hayden', 'Smithsmithsmithsmithsmith'],
  ])('Check error message for NameLast > 2 || < 20 characters', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
  test.each([
    ['hayden1@gmail.com', '1', 'Hayden', 'Smith'],
    ['hayden2@gmail.com', '1234', 'Hayden', 'Smith'],
    ['hayden3@gmail.com', 'abcd', 'Hayden', 'Smith'],
    ['hayden4@gmail.com', '123abcd', 'Hayden', 'Smith'],
  ])('Check error message for Password is less than 8 characters', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
  test.each([
    ['hayden1@gmail.com', '12341234', 'Hayden', 'Smith'],
    ['hayden2@gmail.com', 'abcdabcd', 'Hayden', 'Smith'],
  ])('Check for Password not contain at one number and one letter', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
});

// =============================================================================
// ============================= adminAuthLogin ================================
// =============================================================================
describe('Test for adminAuthLogin', () => {
  beforeEach(() => {
    clear();
  });
  test('200 check successful login', () => {
    const token1 = (adminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const token2 = (adminAuthLogin('iloveemails@gmail.com', 'iloveemail1234').bodyObj as UserCreateReturn).token;
    expect(token2).toStrictEqual(expect.any(String));
  });
  test('400 - Null or emptystring', () => {
    expect(() => adminAuthLogin('', '1234abcd')).toThrow(HTTPError[400]);
    expect(() => adminAuthLogin('     ', '1234abcd')).toThrow(HTTPError[400]);
    expect(() => adminAuthLogin('hayden.smith@unsw.edu.au', '     ')).toThrow(HTTPError[400]);
    expect(() => adminAuthLogin('hayden.smith@unsw.edu.au', '')).toThrow(HTTPError[400]);
  });
  test(' 400 check for existing email', () => {
    expect(() => adminAuthLogin('hayden.smith@unsw.edu.au', '1234abcd')).toThrow(HTTPError[400]);
  });
  test(' 400 right email wrong password', () => {
    const token1 = (adminAuthRegister('hayden.smith@unsw.edu.au', 'iloveemail1234', 'Ilove', 'Emails').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminAuthLogin('hayden.smith@unsw.edu.au', '1230abcd')).toThrow(HTTPError[400]);
  });
});
// TODO
// =============================================================================
// ============================ adminUserDetails ===============================
// =============================================================================
describe('Test for adminUserDetails', () => {
  beforeEach(() => {
    clear();
  });
  test('200 Success case', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    const result = adminUserDetails(token1).bodyObj as UserDetailsReturn;
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
    expect(() => adminUserDetails('')).toThrow(HTTPError[401]);
  });
  test(' 400 invalid token', () => {
    expect(() => adminUserDetails('99999999')).toThrow(HTTPError[401]);
  });
});

// TODO

// =============================================================================
// =========================== adminUserDetailsUpdate ==========================
// =============================================================================
describe('Test for adminUserDetailsUpdate', () => {
  beforeEach(() => {
    clear();
  });
  // Success 200
  test('Check successful updating user: email, NameFirst, nameLast', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    const retVal = adminUserDetailsUpdate(token1, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie');
    expect(retVal.bodyObj).toStrictEqual({});

    const userDetailsRes = adminUserDetails(token1);
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
    expect(() => adminUserDetailsUpdate(null, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie'))
      .toThrow(HTTPError[401]);
    expect(() => adminUserDetailsUpdate(undefined, 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie'))
      .toThrow(HTTPError[401]);
    expect(() => adminUserDetailsUpdate('', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie'))
      .toThrow(HTTPError[401]);
  });
  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminUserDetailsUpdate('99999999', 'smith.hayden@unsw.edu.au', 'Angelina', 'Jolie')).toThrow(HTTPError[401]);
  });
  // Error 400
  test('Check error message if email is currently used by another user', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    expect(() => adminUserDetailsUpdate(token1, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift')).toThrow(HTTPError[400]);
  });
  test('Missing parameters', () => {
    const token1 = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminUserDetailsUpdate(token1, '  ', 'Hayden', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminUserDetailsUpdate(token1, '1234abcd', '', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminUserDetailsUpdate(token1, '1234abcd', 'Hayden', '')).toThrow(HTTPError[400]);
  });
  test.each([
    ['invalid_email'],
    ['email.com'],
    ['email@'],
    ['email@hayden'],
    ['hayden@@gmail.com'],
  ])('update email to %s should return 400 error', async (newEmail) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdate(token, newEmail, 'Hayden', 'Smith')).toThrow(HTTPError[400]);
  });
  test.each([
    ['Ha*yden'],
    ['Hayden7'],
    ['Hayden&Smith'],
    ['H@yden'],
  ])('Check error message for invalid characters in NameFirst: %s', async (invalidName) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdate(token, '1234abcd', invalidName, 'Smith')).toThrow(HTTPError[400]);
  });
  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdate(token, 'hayden1@gmail.com', 'H', 'Smith')).toThrow(HTTPError[400]);
    expect(() => adminUserDetailsUpdate(token, 'hayden2@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith')).toThrow(HTTPError[400]);
  });
  test.each([
    ['Sm_ith'],
    ['Sm*ith'],
    ['Smith3'],
    ['Sm!th'],
  ])('Check error message for invalid characters in NameLast: %s', async (invalidName) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdate(token, '1234abcd', 'Hayden', invalidName)).toThrow(HTTPError[400]);
  });
  test.each([
    ['s'],
    ['Smithsmithsmithsmithsmith'],
  ])('Check error message for NameLast length: %s', async (invalidLastName) => {
    const token = (adminAuthRegister('hayden2@gmail.com', 'iloveemail1234', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(() => adminUserDetailsUpdate(token, 'hayden7@gmail.com', 'Hayden', invalidLastName)).toThrow(HTTPError[400]);
  });
});
// TODO
// =============================================================================
// ========================== adminUserPasswordUpdate ==========================
// =============================================================================

// TODO

// =============================================================================
// ============================= adminAuthLogout ===============================
// =============================================================================
describe('Test for adminAuthlogout', () => {
  beforeEach(() => {
    clear();
  });
  test('Empty token', () => {
    // Error 401 Logout Test Start Here
    expect(() => adminAuthLogout('')).toThrow(HTTPError[401]);
  });
  test('Empty token', () => {
    expect(() => adminAuthLogout('9999999')).toThrow(HTTPError[401]);
  });
  test('success 200', () => {
    // Register Hayden - Session 1
    const token2 = (adminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').bodyObj as UserCreateReturn).token;
    expect(token2).toStrictEqual(expect.any(String));
    const logout = adminAuthLogout(token2);
    expect(logout.bodyObj).toStrictEqual({});
  });
});
// TODO
