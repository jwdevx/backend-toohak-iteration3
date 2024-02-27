import {
    adminAuthRegister,
    adminAuthLogin,
    adminUserDetails,
    adminUserDetailsUpdate,
    adminUserPasswordUpdate 
} from './auth.js';

import { clear } from './other.js';


const ERROR = { error: expect.any(String) };
// beforeEach(() => {
//     clear();
// });


/**
 * Assumptions: 
 *   - password won't have emoji
 * 
 */
describe('adminAuthRegister', () => {

    // beforeEach(() => {
    //     clear();
    // });
    


    // Email address is used by another user return object {error: 'specific error message here'}

    // Email does not satisfy this: https://www.npmjs.com/package/validator (validator.isEmail function). return object {error: 'specific error message here'}

    // NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes. return object {error: 'specific error message here'}

    // NameFirst is less than 2 characters or more than 20 characters.return object {error: 'specific error message here'}

    // NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes. return object {error: 'specific error message here'}

    // NameLast is less than 2 characters or more than 20 characters. return object {error: 'specific error message here'}

    // Password is less than 8 characters. return object {error: 'specific error message here'}

    // Password does not contain at least one number and at least one letter. return object {error: 'specific error message here'}

    // On success Return type if no error:{ authUserId }
    test('Check successful registration', () => {
      let authUserId = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
      expect(authUserId).toStrictEqual({ authUserId: expect.any(Number),});
  
    });      
});





 // test.each([
    //   { name: '', hobby: 'dancing' },
    //   { name: 'Jade', hobby: '' },
    // ])("error: ('$name', '$hobby')", ({ name, hobby }) => {
    //   expect(academicCreate(name, hobby)).toStrictEqual(ERROR);
    // });
  
    // test('correct return type', () => {
    //   const academic = academicCreate('Magnus', 'chess');
    //   expect(academic).toStrictEqual({ academicId: expect.any(Number),});
  
    // });  
    