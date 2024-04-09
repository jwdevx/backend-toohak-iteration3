import HTTPError from 'http-errors';
import { adminAuthRegister, adminUserDetails, clear } from './apiRequestsIter3';
import { UserCreateReturn, EmptyObject } from './returnInterfaces';

describe('Testing the clear function', () => {
  beforeEach(() => {
    clear();
  });

  test('Successfully clears all posts', () => {
    // First create user
    const sessionId1 = (adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith').bodyObj as UserCreateReturn).token;
    expect(sessionId1).toStrictEqual(expect.any(String));

    // Then delete the Post
    const clearRes = clear().bodyObj as EmptyObject;
    expect(clearRes).toStrictEqual({});

    // Check user is empty
    expect(() => adminUserDetails(sessionId1)).toThrow(HTTPError[401]);
  });
});
