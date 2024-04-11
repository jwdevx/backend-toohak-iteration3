import HTTPError from 'http-errors';

import {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogoutV2,
  adminUserDetailsUpdate,
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

