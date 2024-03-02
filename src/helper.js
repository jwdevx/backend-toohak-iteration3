import validator from 'validator';
import { getData } from './dataStore.js';

/**
 * Helper Function used in auth.js, quiz.js 
 * Checks if the provided AuthUserId does not correspond to any existing user.
 * 
 * @param {integer} authUserId - The user ID to be validated.
 * @returns {boolean} Returns true if the AuthUserId does not match any existing user's userId
 */
export function findUserId(authUserId) {
	let data = getData(); 
	return data.users.find(user => user.userId === authUserId);
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

/**
 * Helper Function used in quiz.js 
 * Checks if the provided quiz name does not correspond to any existing quiz.
 * 
 * @param {string} name - The quiz name to be validated.
 * @returns {boolean} Returns true if the name does not match any existing quiz's name
 */
export function UsedQuizName(name) {
	let data = getData(); 
	return data.quizzes.find(quiz => quiz.name === name);
}

/**
 * Helper Function used in quiz.js 
 * Check if name is less than 3 characters or more than 30 characters.
 *
 * @param {string} name - The name string to be validated for length.
 * @returns {boolean} - Returns true if name is invalid (either too short or too long).
 */
export function invalidQuizNameLength(name) {
	return (name.length < 3 || name.length > 30);
}

/**
 * Helper Function used in quiz.js 
 * Check if descriptionis less than 2 characters or more than 100 characters.
 *
 * @param {string} name - The description string to be validated for length.
 * @returns {boolean} - Returns true if description is invalid (either too short or too long).
 */
export function invalidDescriptionLength(name) {
	return (name.length < 2 || name.length > 100);
}

/**
 * Helper Function used in quiz.js 
 * Test if quiz name contains characters other than lowercase letters, 
 * uppercase letters, spaces or numbers.
 * 
 * @param {string} name - The name to be validated.
 * @returns {boolean} - Returns true if the name contains invalid characters 
 */
export function invalidQuizName(name) {
	const isAlphanumericAndSpaces = validator.isWhitelisted(name, 
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ');
	return (!isAlphanumericAndSpaces)
}