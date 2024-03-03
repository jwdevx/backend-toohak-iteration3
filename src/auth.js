import { getData, setData } from './dataStore.js';
import {
  findUserId,
  invalidEmail,
  invalidUserName,
  invalidNameLength
} from './helper.js';


let UserIdGenerator = 1;

/**
 * Register a user with an email, password, and names, then returns their 
 * authUserId value.
 *
 * @param {string} email - email address of the user
 * @param {string} password - The password for the user
 * @param {string} nameFirst - The first name of the user
 * @param {string} nameLast - The last name of the user
 * @returns {{authUserId: number}} An object containing the authenticated user ID.
 */
export function adminAuthRegister(email, password, nameFirst, nameLast) {

  // Basic validation for missing or null values
  if (!email || !password || !nameFirst || !nameLast ) return { error: 'One or more missing parameters' };

  let data = getData();
  if (data.users.some(existingUser => existingUser.email === email)) {
    return { error: 'Email address is used by another user' };
  }

  if (invalidEmail(email)) return { error: 'Invalid email address: email is not a string' };
  if (invalidUserName(nameFirst)) return { error: 'First name contains invalid characters' };
  if (invalidNameLength(nameFirst)) return { error: 'First name must be between 2 and 20 characters long' };
  if (invalidUserName(nameLast)) return { error: 'Last name contains invalid characters' };
  if (invalidNameLength(nameLast)) return { error: 'Last name must be between 2 and 20 characters long' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters long' };

  // Return error if Password does not contain at least one number and at least one letter
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
    return { error: 'Password must contain at least one letter and one number' };
  }

  // If no error, we will register user
  const newUser = {
    userId: UserIdGenerator,
    nameFirst: nameFirst,
    nameLast: nameLast,
    name: `${nameFirst} ${nameLast}`,
    email: email,
    password: password,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  };    

  UserIdGenerator += 1;  
  data.users.push(newUser);
  setData(data); 

  return {
    authUserId: newUser.userId,
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
  if (!email || !password) return { error: "One or more missing parameters" };
  
  let data = getData();
  const user = data.users.find((user) => user.email === email);
  
  if (!user) {
    return {
      error: "Email address does not exist",
    };
  } else if (user.password !== password) {
    return {
      error: "Password does not match email",
    };
  }

  //TODO add counter for update logins succes + fail & setData(data);

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
//helper functions for adminUserDetails
export function adminUserDetails(authUserId) {
  
  let dataStore = getData();
  const user = dataStore.users.find((user) => user.userId === authUserId);
  if (!user) return { error: "UserId is invalid" };

  return {
    user: {
      userId: authUserId,
      name: user.name,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    },
  };
}

/**
 * Given an admin user's authUserId and a set of properties, update the 
 * properties of this logged in admin user.
 *
 * @param {integer} authUserId - the admin's user authenticated user ID
 * @param {string} email - email address of the admin user
 * @param {string} nameFirst - The first name of the admin user
 * @param {string} nameLast - The last name of the admin user.
 * @returns { }  null
 */
export function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {

  // Basic validation for missing or null values
  if (!authUserId || !email || !nameFirst || !nameLast ) return { error: 'One or more missing parameters' };

  let data = getData();	
  const authUser = findUserId(authUserId);
  if (!authUser) return { error: 'AuthUserId is not a valid user' };

  // Return error if email is currently used by another user (excluding the current authorised user)
  if (data.users.some(otherUser => otherUser.email === email && otherUser.userId !== authUserId)) {
    return { error: 'Email is currently used by another user, choose another email!' };
  };
  if (invalidEmail(email)) return { error: 'Invalid email address: email is not a string' };
  if (invalidUserName(nameFirst)) return { error: 'First name contains invalid characters' };
  if (invalidNameLength(nameFirst)) return { error: 'First name must be between 2 and 20 characters long' };
  if (invalidUserName(nameLast)) return { error: 'Last name contains invalid characters' };
  if (invalidNameLength(nameLast)) return { error: 'Last name must be between 2 and 20 characters long' };

  authUser.nameFirst = nameFirst;
  authUser.nameLast = nameLast;
  authUser.name = `${nameFirst} ${nameLast}`;
  authUser.email = email;
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
  let data = getData();	

  //TODO WRITE CODE HERE ->


  setData(data);
  return {}

}
