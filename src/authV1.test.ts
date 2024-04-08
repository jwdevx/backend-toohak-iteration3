import HTTPError from 'http-errors';

import {
  adminAuthLogin,
  adminAuthRegister,
  clear
} from './apiRequestsIter3';
import { UserCreateReturn } from './returnInterfaces';
beforeEach(() => {
  clear();
});

// TODO VENUS authV1.test.ts
// TODO VENUS authV2.test.ts   - duplicate authV1.test.ts and change functioname to V2
// TODO VENUS otherV1.test.ts  - change to throw

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
    const token1 = (adminAuthRegister('iloveemails@gmail.com', 'iloveemail1234', 'Ilove', 'Emails').bodyObj as UserCreateReturn).token;
    expect(token1).toStrictEqual(expect.any(String));
    expect(() => adminAuthLogin('hayden.smith@unsw.edu.au', '1230abcd')).toThrow(HTTPError[400]);
  });
});
// TODO
// =============================================================================
// ============================ adminUserDetails ===============================
// =============================================================================

// TODO

// =============================================================================
// =========================== adminUserDetailsUpdate ==========================
// =============================================================================

// TODO
// =============================================================================
// ========================== adminUserPasswordUpdate ==========================
// =============================================================================

// TODO

// =============================================================================
// ============================= adminAuthLogout ===============================
// =============================================================================

// TODO
