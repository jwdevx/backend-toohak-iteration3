import { getData, setData } from './dataStore.js';
import validator from 'validator';


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
	let data = getData();

	// Return error if email address is used by another user
	if (data.users.some(existingUser => existingUser.email === email)) {
		return { error: 'Email address is used by another user' };
	}

	// Return error if email does not satisfy this: https://www.npmjs.com/package/validator 
	if (!validator.isEmail(email)){
		return { error: 'Invalid email address: email is not a string' };
	}

	// Return error if NameFirst contains invalid characters
	const regex = /^[a-zA-Z\s\-']+$/;
	if (!regex.test(nameFirst)) {
		return { error: 'First name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
	}

	// Return error if NameFirst is less than 2 characters or more than 20 characters.
	if (nameFirst.length < 2 || nameFirst.length > 20) {
		return { error: 'First name must be between 2 and 20 characters long' };
	}

	// Return error if NameLast contains invalid characters
	if (!regex.test(nameLast)) {
		return { error: 'Last name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
	}

	// Return error if  NameLast is less than 2 characters or more than 20 characters
	if (nameLast.length < 2 || nameLast.length > 20) {
		return { error: 'Last name must be between 2 and 20 characters long' };
	}

	// Return error if Password is less than 8 characters. 
	if (password.length < 8) {
		return { error: 'Password must be at least 8 characters long' };
	}

	// Return error if Password does not contain at least one number and at least one letter
	if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
			return { error: 'Password must contain at least one letter and one number' };
	}

	// If no error, we will register user
	const newUser = {
		userId: 1,
		nameFirst: nameFirst,
		nameLast: nameLast,
		email: email,
		password: password,
	};    
	data.users.push(newUser);

	//Saved the updated data
	setData(data); 

	UserIdGenerator += 1;  
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
function adminAuthLogin(email, password) {
    return {
      authUserId: 1,
    }
}


/**
 * Given an admin user's authUserId, return details about the user.
 *  "name" is the first and last name concatenated with a single space between them.
 *
 * @param {integer} authUserId - the admin's user authenticated user ID
 * @returns {user: {userId: ,name: ,email: ,numSuccessfulLogins: ,numFailedPasswordsSinceLastLogin: ,}} An object containing the properties related to a user.
 */
function adminUserDetails(authUserId) {
    return {
        user: {
            userId: 1,
            name: 'Hayden Smith',
            email: 'hayden.smith@unsw.edu.au',
            numSuccessfulLogins: 3,
            numFailedPasswordsSinceLastLogin: 1,
        }
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
function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
    return {  }
}


/**
 * Given details relating to a password change, update the password of a logged in user.
 *
 * @param {string} oldPassword - The oldpassword for the user
 * @param {string} newPassword - The newpassword for the user
 * @returns { } null
 */
function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    return { }

}
