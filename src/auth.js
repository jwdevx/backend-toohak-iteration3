
/**
 * Registers an admin user with the provided details.
 *
 * @param {string} email - email address of the admin.
 * @param {string} password - The password for the admin account.
 * @param {string} nameFirst - The first name of the admin.
 * @param {string} nameLast - The last name of the admin.
 * @returns {{authUserId: number}} An object containing the authenticated user ID.
 */
function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1
    }
}