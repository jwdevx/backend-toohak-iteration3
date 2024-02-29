import validator from 'validator';
import { getData } from './dataStore';

/**
 * Helper Function used in auth.js, quiz.js 
 * Checks if the provided AuthUserId does not correspond to any existing user.
 * 
 * @param {integer} authUserId - The user ID to be validated.
 * @returns {boolean} Returns true if the AuthUserId does not match any existing user's userId
 */
export function invalidAuthUserId(authUserId) {
	let data = getData(); 
	return !data.users.some(user => user.userId === authUserId);
}
	
/**
 * Helper Function used in auth.js 
 * Validates an email address to check if email does not satisfy 
 * this: https://www.npmjs.com/package/validator (validator.isEmail)
 * 
 * Uses the `validator` library's `isEmail` method to perform the validation.
 * 
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - Returns true if the email is invalid, false otherwise.
 */
export function invalidEmail(email) {
  return !validator.isEmail(email);
}


/**
 * Helper Function used in auth.js 
 * Test if nameFirst or nameLast contains characters other than lowercase letters, 
 * uppercase letters, spaces, hyphens, or apostrophes.
 * 
 * @param {string} name - The name to be validated.
 * @returns {boolean} - Returns true if the name contains invalid characters 
 */
export function invalidUserName(name) {
	const regex = /^[a-zA-Z\s\-']+$/;
	return !(regex.test(name));
}


/**
 * Helper Function used in auth.js 
 * Check if nameFirst or nameLast is less than 2 characters or more than 20 characters.
 *
 * @param {string} name - The name string to be validated for length.
 * @returns {boolean} - Returns true if name is invalid (either too short or too long).
 */
export function invalidNameLength(name) {
	return (name.length < 2 || name.length > 20);
}

