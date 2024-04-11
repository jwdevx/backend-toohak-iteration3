import HTTPError from 'http-errors';
import { UserCreateReturn, UserDetailsReturn } from './returnInterfaces';
import {
  adminAuthRegister,
  adminUserDetailsV2,
  adminAuthLogoutV2,
  adminUserDetailsV2Update,
  adminUserPasswordUpdate,
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

