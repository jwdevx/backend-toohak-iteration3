import {
  adminAuthRegister,
  //   adminUserDetails,
  clear
} from './apiRequests';

describe('Testing the clear function', () => {
  beforeEach(() => {
    clear();
  });

  test('Successfully clears all posts', () => {
    // First create user
    const res = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(res.statusCode).toStrictEqual(200);
    expect(res.bodyObj).toStrictEqual({ token: expect.any(String) });
    const sessionIdNumber = Number(decodeURIComponent(res.bodyObj.token));
    expect(sessionIdNumber).not.toBeNaN();

    // Then delete the Post
    const clearRes = clear();
    expect(clearRes.statusCode).toBe(200);
    expect(clearRes.bodyObj).toStrictEqual({});

    // Check user is empty
    /*
    const userDetailsRes = adminUserDetails(res.bodyObj.token);
    expect(userDetailsRes.statusCode).toBe(200);
    expect(userDetailsRes.BodyObj).toStrictEqual({ user: null })
    */
  });
});
