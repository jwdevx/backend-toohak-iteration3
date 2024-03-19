
/* eslint-disable */
// @ts-nocheck
//TODO REMOVE THIS 2 COMMENTS ABOVE when this file is lintsafe and typesafe
/*
There is this 11  number of errors in typecheck in this file: 11  src/auth.ts:50
*/
//TODO REMOVE THIS COMMENTS ABOVE ----------------------------------------------

// Importing intefaces
import {
  Users,
  Tokens,
  ErrorObject
} from './dataStore';

// Importing functions
import { getData, setData } from './dataStore';
import {
  findSessionId,
  findUserId,
  invalidEmail,
  invalidUserName,
  invalidNameLength,
} from './helper';

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
): { error: string} | { token: string} {

    const data: DataStore = getData();
  if (data.users.some(existingUser => existingUser.email === email)) {
    return { error: 'Email address is used by another user' };
  }
  if (invalidEmail(email)) return { error: 'Invalid email address: email is not a string' };
  if (invalidUserName(nameFirst)) return { error: 'First name contains invalid characters' };
  if (invalidNameLength(nameFirst)) return { error: 'First name must be between 2 and 20 characters long' };
  if (invalidUserName(nameLast)) return { error: 'Last name contains invalid characters' };
  if (invalidNameLength(nameLast)) return { error: 'Last name must be between 2 and 20 characters long' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters long' };
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
    return { error: 'Password must contain at least one letter and one number' };
  }
  const sessionId: number = Math.floor(Math.random() * Date.now());
  const newUser: Users = {
    userId: data.users.length + 1,
    nameFirst: nameFirst,
    nameLast: nameLast,
    name: `${nameFirst} ${nameLast}`,
    email: email,
    password: password,
    oldPasswords: [],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  };
  data.users.push(newUser);  
  const newToken: Tokens = {
    sessionId: sessionId,
    userId: newUser.userId,
  };
  data.tokens.push(newToken);  
  setData(data);
  return {
    token: encodeURIComponent(sessionId.toString()),
  };
  
}

/**
 * Given a registered user's email and password returns their authUserId value
 *
 * @param {string} email - email address of the user
 * @param {string} password - The password for the user
 * @returns {{authUserId: number}} An object containing the authenticated user ID.
 */
export function adminAuthLogin(email, password) {

  // Basic validation for missing or null values
  if (!email || !password) {
    return { error: 'One or more missing parameters' };
  }
  const data: DataStore = getData();
  const user = data.users.find((user) => user.email === email);

  if (!user) {
    return {
      error: 'Email address does not exist',
    };
  } else if (user.password !== password) {
    user.numFailedPasswordsSinceLastLogin += 1;
    return {
      error: 'Password does not match email',
    };
  }

  user.numFailedPasswordsSinceLastLogin = 0;
  user.numSuccessfulLogins += 1;
    
  /* pseudocode from lecture 
  const sessionId: number = Math.floor(Math.random() * Date.now()),
  user.sessions.push(sessionId);
  return {
    token: encodeURIComponent(sessionId.toString()),
  };
  */
    
  setData(data);
  return {
    authUserId: user.userId,
  };
}

/**
 * Given an admin user's authUserId, return details about the user.
 *  "name" is the first and last name concatenated with a single space between them.
 *
 * @param {integer} authUserId - the admin's user authenticated user ID
 * An object containing the properties related to a user.
 * @returns {user: {userId: ,name: ,email: ,numSuccessfulLogins: ,numFailedPasswordsSinceLastLogin: ,}}
 */
// helper functions for adminUserDetails
export function adminUserDetails (token: number) {
  const user = findUserFromToken(token);
  if (!user) {
    return { error: 'could not find user' };
  }
  const fullName = `${user.firstName} ${user.lastName}`;
  return {
    user: {
      userId: user.userId,
      name: fullName,
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
  
  const data: DataStore = getData();
  const sessionId = parseInt(decodeURIComponent(token));  
  if (!token || isNaN(sessionId) ) {
    return { error: 'Token is empty or not provided', status: 401,};
  } 

  const validToken = findSessionId(sessionId);  
  if (!validToken) {
    return {
      error: 'Token is invalid (does not refer to valid logged in user session)',
      status: 401,
    };
  }   
  const user = findUserId(validToken.userId); 
  
  //TODO check with tutor about this errors?
  // if (!authUser) return { error: "User not found", status: 404  }; 

  // if (Valid token is provided, but user is not an owner of this quiz)) {
  //   return {
  //     error: 'FORBIDDEN - Valid token is provided, but user is not an owner of this quiz',
  //     status: 403,
  //   };
  // }


  if (data.users.some(otherUser => otherUser.email === email && otherUser.userId !== user)) {
    return {
      error: 'Email is currently used by another user, choose another email!', status: 400,
    };
  }
  if (invalidEmail(email)) {
    return {
      error: 'Invalid email address: email is not a string', status: 400,
    };
  }
  if (invalidUserName(nameFirst)) {
    return {
      error: 'First name contains invalid characters', status: 400,
    };
  }
  if (invalidNameLength(nameFirst)) {
    return {
      error: 'First name must be between 2 and 20 characters long',  status: 400,
    };
  }
  if (invalidUserName(nameLast)) {
    return {
      error: 'Last name contains invalid characters', status: 400,
    };
  }
  if (invalidNameLength(nameLast)) {
    return {
      error: 'Last name must be between 2 and 20 characters long', status: 400,
    };
  }

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
export function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
  // Basic validation for missing or null values
  if (!authUserId || !oldPassword || !newPassword) return { error: 'One or more missing parameters' };

  const user = findUserId(authUserId);
  if (!user) return { error: 'AuthUserId is not a valid user' };

  const data: DataStore = getData();
  if (user.password !== oldPassword) return { error: 'The old password is wrong.' };
  if (oldPassword === newPassword) return { error: 'The new password is the same as the old password.' };
  if (user.oldPasswords.includes(newPassword)) return { error: 'The new password is used before.' };
  if (newPassword.length < 8) return { error: 'Password must be at least 8 characters long' };
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(newPassword)) {
    return { error: 'Password must contain at least one letter and one number' };
  }

  user.oldPasswords.push(oldPassword);
  user.password = newPassword;

  setData(data);
  return {};
}

//TODO  - adminAuthLogout
export function adminAuthLogout() { }