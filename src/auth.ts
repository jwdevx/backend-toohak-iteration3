import HTTPError from 'http-errors';
import { Users, Tokens, ErrorObject, DataStore } from './dataStore';
import { getData, setData } from './dataStore';
import {
  findSessionId, findUserId, invalidEmail, invalidUserName,
  invalidNameLength, randomIdGenertor
} from './helper';

interface UserDetails {
  userId: number;
  name: string;
  email: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}
interface UserDetailsReturn {
  user: UserDetails;
}
import crypto from 'crypto';

/**
 * Register a user with an email, password, and names, then returns their
 * authUserId value.
 *
 * @param {string} email - email address of the user
 * @param {string} password - The password for the user
 * @param {string} nameFirst - The first name of the user
 * @param {string} nameLast - The last name of the user
 * @returns {{token: string} | {error: string}} An object: sessionId or an error msg.
 */
export function adminAuthRegister(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): { token: string } | ErrorObject {
  // 1.Error 400 - ensure parameters are not undefined, null, or empty ("")
  if (!email || !password || !nameFirst || !nameLast ||
    !String(email).trim() || !String(password).trim() ||
    !String(nameFirst).trim() || !String(nameLast).trim()) {
    throw HTTPError(400, 'One or more missing parameters');
  }
  const data: DataStore = getData();
  if (data.users.some(existingUser => existingUser.email === email)) {
    throw HTTPError(400, 'Email address is used by another user');
  }
  if (invalidEmail(email)) throw HTTPError(400, 'Invalid email address: email is not a string');
  if (invalidUserName(nameFirst)) throw HTTPError(400, 'First name contains invalid characters');
  if (invalidNameLength(nameFirst)) throw HTTPError(400, 'First name must be between 2 and 20 characters long');
  if (invalidUserName(nameLast)) throw HTTPError(400, 'Last name contains invalid characters');
  if (invalidNameLength(nameLast)) throw HTTPError(400, 'Last name must be between 2 and 20 characters long');
  if (password.length < 8) throw HTTPError(400, 'Password must be at least 8 characters long');
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
    throw HTTPError(400, 'Password must contain at least one letter and one number');
  }
  // Success 200
  const id = randomIdGenertor();
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const newUser: Users = {
    userId: id,
    nameFirst: nameFirst,
    nameLast: nameLast,
    name: `${nameFirst} ${nameLast}`,
    email: email,
    password: hash,
    oldPasswords: [],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  };
  const sessionId: number = Math.floor(Math.random() * Date.now());
  const newToken: Tokens = {
    sessionId: sessionId,
    userId: newUser.userId,
  };
  data.users.push(newUser);
  data.tokens.push(newToken);
  setData(data);
  return {
    token: encodeURIComponent(sessionId.toString())
  };
}

/**
 * Given a registered user's email and password returns their authUserId value
 *
 * @param {string} email - email address of the user
 * @param {string} password - The password for the user
 * @returns {{authUserId: number}} An object containing the authenticated user ID.
 */
export function adminAuthLogin(email: string, password: string): { token: string } | ErrorObject {
  // 1.Error 400
  if (!email || !password || !String(email).trim() || !String(password).trim()) {
    return { error: 'One or more missing parameters', status: 400 };
  }
  const data: DataStore = getData();
  const user = data.users.find((user) => user.email === email);
  if (!user) {
    return { error: 'Email address does not exist', status: 400 };
  } else if (user.password !== password) {
    user.numFailedPasswordsSinceLastLogin++;
    return { error: 'Password does not match email', status: 400 };
  }
  // Success 200
  user.numSuccessfulLogins++;
  const sessionId: number = Math.floor(Math.random() * Date.now());
  const newToken: Tokens = {
    sessionId: sessionId,
    userId: user.userId,
  };
  data.tokens.push(newToken);
  user.numFailedPasswordsSinceLastLogin = 0;
  setData(data);
  return {
    token: encodeURIComponent(sessionId.toString()),
  };
}

/**
 * Given an admin user's authUserId, return details about the user.
 *  "name" is the first and last name concatenated with a single space between them.
 *
 * @param {string} token  -  user sessionId
 * @returns {user: {userId: ,name: ,email: ,numSuccessfulLogins: ,numFailedPasswordsSinceLastLogin: ,}}
 */
export function adminUserDetails(token: string): UserDetailsReturn | ErrorObject {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // Success 200
  const user = findUserId(validToken.userId);
  return {
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
}

/**
 * Given an admin user's authUserId and a set of properties, update the
 * properties of this logged in admin user (non-password).
 *
 * @param {string} token -  user sessionId
 * @param {string} email - email address of the admin user
 * @param {string} nameFirst - The first name of the admin user
 * @param {string} nameLast - The last name of the admin user.
 * @returns { }  null
 */
export function adminUserDetailsUpdate(
  token: string,
  email: string,
  nameFirst: string,
  nameLast: string): ErrorObject | Record<string, never> {
  // 1.Error 401
  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };
  }

  // 2.Error 400
  if (!email || !nameFirst || !nameLast) return { error: 'One or more missing parameters', status: 400 };
  if (!String(email).trim() || !String(nameFirst).trim() || !String(nameLast).trim()) {
    return { error: 'One or more missing parameters', status: 400 };
  }
  const user = findUserId(validToken.userId);
  if (data.users.some(otherUser => otherUser.email === email && otherUser.userId !== user.userId)) {
    return {
      error: 'Email is currently used by another user, choose another email!', status: 400
    };
  }
  if (invalidEmail(email)) {
    return { error: 'Invalid email address: email is not a string', status: 400 };
  }
  if (invalidUserName(nameFirst)) {
    return { error: 'First name contains invalid characters', status: 400 };
  }
  if (invalidNameLength(nameFirst)) {
    return { error: 'First name must be between 2 and 20 characters long', status: 400 };
  }
  if (invalidUserName(nameLast)) {
    return { error: 'Last name contains invalid characters', status: 400 };
  }
  if (invalidNameLength(nameLast)) {
    return { error: 'Last name must be between 2 and 20 characters long', status: 400 };
  }
  // Success 200
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;
  user.name = `${nameFirst} ${nameLast}`;
  user.email = email;
  setData(data);
  return {};
}

/**
 * Given details relating to a password change, update the password of a logged in user.
 *
 * @param {string} oldPassword - The oldpassword for the user
 * @param {string} newPassword - The newpassword for the user
 * @returns { } null
 */
export function adminUserPasswordUpdate(
  token: string,
  oldPassword: string,
  newPassword: string): ErrorObject | Record<string, never> {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) {
    return { error: 'token is empty or invalid', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) return { error: 'token is empty or invalid', status: 401 };

  // 2.Error 400
  const data: DataStore = getData();
  if (!oldPassword || !newPassword || !String(oldPassword).trim() || !String(newPassword).trim()) {
    return { error: 'One or more missing parameters', status: 400 };
  }
  const user = findUserId(validToken.userId);
  if (user.password !== oldPassword) return { error: 'The old password is wrong.', status: 400 };
  if (oldPassword === newPassword) return { error: 'The new password is the same as the old password.', status: 400 };
  if (user.oldPasswords.some(passwordObj => passwordObj.password === newPassword)) {
    return { error: 'The new password has been used before.', status: 400 };
  }
  if (newPassword.length < 8) return { error: 'Password must be at least 8 characters long', status: 400 };
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(newPassword)) {
    return { error: 'Password must contain at least one letter and one number', status: 400 };
  }
  // Success 200
  user.oldPasswords.push({ password: oldPassword });
  user.password = newPassword;
  setData(data);
  return {};
}

/**
 * Logs out an admin user who has an active quiz session.
 * Should be called with a token that is returned after either a login or register has been made.
 *
 * @param {string} token - the sessionId of the user in the Token array
 * @returns {Object} empty objects indicating success OR an object with an error: string message
 */
export function adminAuthLogout(token: string): ErrorObject | Record<string, never> {
  // 1.Error 401
  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || !String(token).trim() || isNaN(sessionId)) return { error: 'Token is empty or not provided', status: 401 };

  const validToken = data.tokens.findIndex(tokens => tokens.sessionId === sessionId);
  if (validToken === -1) return { error: 'Token is invalid (does not refer to valid logged in user session)', status: 401 };

  // Success 200
  data.tokens.splice(validToken, 1);
  setData(data);
  return {};
}
