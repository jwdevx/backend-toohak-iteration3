
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
function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1
    }
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