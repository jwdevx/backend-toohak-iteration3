import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate, 
} from './auth.js';

import { clear } from './other.js';
import { getData } from './dataStore';

const ERROR = { error: expect.any(String) };
beforeEach(() => {
  clear();
});


/**
 * Test for adminAuthRegister Function working properly
 * 
 * Assumptions: 
 *   - password won't have emoji
 *   - Only ASCII characters are allowed in passwords.
 *   - no whitespace
 */
describe('adminAuthRegister', () => {

  beforeEach(() => {
    clear();
  });

  test('Missing parameters', () => {
    const retVal = adminAuthRegister();
    expect(retVal).toStrictEqual({ error: 'One or more missing parameters'});
  });    

  test('Check error message for duplicate existing email', () => {
    let UserId = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    let duplicate = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(duplicate).toStrictEqual({ error: 'Email address is used by another user'});    
  });      

  test.each([
    ['invalid_email', '1234abcd', 'Hayden', 'Smith'],
    ['email.com', '1234abcd', 'Hayden', 'Smith'],
    ['email@', '1234abcd', 'Hayden', 'Smith'],
    ['email@hayden', '1234abcd', 'Hayden', 'Smith'],
    ['hayden@@gmail.com', '1234abcd', 'Hayden', 'Smith'],
    ['hay?den@[192.168.1.1]', '1234abcd', 'Hayden', 'Smith']
  ])('("%s") does not satify validator.isEmail function', (email, password, nameFirst, nameLast) => {
    expect(adminAuthRegister(email, password, nameFirst, nameLast)).toStrictEqual({ error: 'Invalid email address: email is not a string' });
  });

  test('Check error message for invalid characters on NameFirst', () => {
    let NameFirst1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Ha*yden', 'Smith');
    let NameFirst2 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden7', 'Smith');
    let NameFirst3 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden&Smith', 'Smith');
    let NameFirst4 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'H@yden', 'Smith');
    expect(NameFirst1).toStrictEqual({ error: 'First name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
    expect(NameFirst2).toStrictEqual(ERROR); 
    expect(NameFirst3).toStrictEqual(ERROR); 
    expect(NameFirst4).toStrictEqual(ERROR); 
  });  

  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    let NameFirst1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'H', 'Smith');
    let NameFirst2 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Haydenhaydenhaydenhayden', 'Smith');
    expect(NameFirst1).toStrictEqual(ERROR); 
    expect(NameFirst2).toStrictEqual(ERROR); 
  });  

  test('Check error message for invalid characters on NameLast', () => {
    let NameLast1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm_ith');
    let NameLast2 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm*ith');
    let NameLast3 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith3');
    let NameLast4 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Sm!th');
    expect(NameLast1).toStrictEqual({ error: 'Last name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    expect(NameLast2).toStrictEqual(ERROR); 
    expect(NameLast3).toStrictEqual(ERROR); 
    expect(NameLast4).toStrictEqual(ERROR); 
  });    

  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    let NameLast1 = adminAuthRegister('hayden@gmail.com', '1234abcd', 'Hayden', 's');
    let NameLast2 = adminAuthRegister('hayden@gmail.com', '1234abcd', 'Hayden', 'Smithsmithsmithsmithsmith');
    expect(NameLast1).toStrictEqual({ error: 'Last name must be between 2 and 20 characters long' });
    expect(NameLast2).toStrictEqual(ERROR); 
 
  });  
 
  test('Check error message for Password is less than 8 characters', () => {
    let Pass1 = adminAuthRegister('hayden@gmail.com', '1', 'Hayden', 'Smith');
    let Pass2 = adminAuthRegister('hayden@gmail.com', '1234', 'Hayden', 'Smith');
    let Pass3 = adminAuthRegister('hayden@gmail.com', 'abcd', 'Hayden', 'Smith');
    let Pass4 = adminAuthRegister('hayden@gmail.com', '123abcd', 'Hayden', 'Smith');
    expect(Pass1).toStrictEqual({ error: 'Password must be at least 8 characters long'});
    expect(Pass2).toStrictEqual(ERROR); 
    expect(Pass3).toStrictEqual(ERROR); 
    expect(Pass4).toStrictEqual(ERROR); 
  });    

  test('Check error message for Password does not contain at least one number and at least one letter', () => {
    let Pass1 = adminAuthRegister('hayden@gmail.com', '12341234', 'Hayden', 'Smith');
    let Pass2 = adminAuthRegister('hayden@gmail.com', 'abcdabcd', 'Hayden', 'Smith');
    expect(Pass1).toStrictEqual({ error: 'Password must contain at least one letter and one number' });
    expect(Pass2).toStrictEqual(ERROR); 
  });    
  
  test('Check successful registration: return type if no error:{ authUserId }', () => {
    let authUserId = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(authUserId).toStrictEqual({ authUserId: expect.any(Number),});
  });      
  

});


/**
 * Test for adminAuthLogin Function working properly
 */
describe('adminAuthLogin', () => {

  // beforeEach(() => {
  //   clear();
  // });




});    


/**
 * Test for adminUserDetails Function working properly
 */
describe('adminUserDetails', () => {

  // beforeEach(() => {
  //   clear();
  // });


  

});    
    

/**
 * Test for adminUserDetailsUpdate Function working properly
 */

describe('adminUserDetailsUpdate', () => {

  beforeEach(() => {
    clear();
  });

  test('Missing parameters', () => {
    const retVal = adminUserDetailsUpdate();
    expect(retVal).toStrictEqual({ error: 'One or more missing parameters'});
  });    

  test('Update with AuthUserId that doesn\'t exist', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const retVal = adminUserDetailsUpdate(1531, 'smith.hayden@unsw.edu.au', 'Smith', 'Hayden')
    expect(retVal).toStrictEqual({error: 'AuthUserId is not a valid user'});
  });      

 
  test('Check error message if email is currently used by another user', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    let user2 = adminAuthRegister('taylor.swift@unsw.edu.au', '5678efgh', 'Taylor', 'Swift');
    const retVal = adminUserDetailsUpdate(user1.authUserId, 'taylor.swift@unsw.edu.au', 'Jonathan', 'Swift'); 
    expect(retVal).toStrictEqual({ error: 'Email is currently used by another user, choose another email!'});
  });
 
  test('Check error message if email to update is not valid', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const email1 = adminUserDetailsUpdate(user1.authUserId, 'invalid_email', 'Hayden', 'Smith'); 
    const email2 = adminUserDetailsUpdate(user1.authUserId, 'email.com', 'Hayden', 'Smith'); 
    const email3 = adminUserDetailsUpdate(user1.authUserId, 'email@', 'Hayden', 'Smith'); 
    const email4 = adminUserDetailsUpdate(user1.authUserId, 'email@hayden', 'Hayden', 'Smith'); 
    const email5 = adminUserDetailsUpdate(user1.authUserId, 'hayden@@gmail.com', 'Hayden', 'Smith'); 
    expect(email1).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(email2).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(email3).toStrictEqual({ error: 'Invalid email address: email is not a string' });
    expect(email4).toStrictEqual({ error: 'Invalid email address: email is not a string' });  
  });  

  test('Check error message for invalid characters on NameFirst', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Ha*yden', 'Smith'); 
    const NameFirst2 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden7', 'Smith'); 
    const NameFirst3 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden&Smith', 'Smith'); 
    const NameFirst4 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'H@yden', 'Smith'); 
    expect(NameFirst1).toStrictEqual({ error: 'First name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
    expect(NameFirst2).toStrictEqual(ERROR); 
    expect(NameFirst3).toStrictEqual(ERROR); 
    expect(NameFirst4).toStrictEqual(ERROR); 
  });  

  test('Check error message for NameFirst less than 2 characters or more than 20 characters', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameFirst1 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'H', 'Smith'); 
    const NameFirst2 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Haydenhaydenhaydenhayden', 'Smith'); 
    expect(NameFirst1).toStrictEqual(ERROR); 
    expect(NameFirst2).toStrictEqual(ERROR); 
  });  

  test('Check error message for invalid characters on NameLast', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden', 'Sm_ith'); 
    const NameLast2 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden', 'Sm*ith'); 
    const NameLast3 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden', 'Smith3'); 
    const NameLast4 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden', 'Sm!th'); 
    expect(NameLast1).toStrictEqual({ error: 'Last name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes'});
    expect(NameLast2).toStrictEqual(ERROR); 
    expect(NameLast3).toStrictEqual(ERROR); 
    expect(NameLast4).toStrictEqual(ERROR); 
  });    

  test('Check error message for NameLast less than 2 characters or more than 20 characters', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const NameLast1 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden', 's'); 
    const NameLast2 = adminUserDetailsUpdate(user1.authUserId, 'hayden@gmail.com', 'Hayden', 'Smithsmithsmithsmithsmith');     
    expect(NameLast1).toStrictEqual({ error: 'Last name must be between 2 and 20 characters long' });
    expect(NameLast2).toStrictEqual(ERROR); 
  });  

  test('Check successful updating user: email, NameFirst, nameLast', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const retVal = adminUserDetailsUpdate(user1.authUserId, 'smith.hayden@unsw.edu.au', 'Smith', 'Hayden')
    expect(retVal).toStrictEqual({});

    const updatedData = getData();
    const updatedUser = updatedData.users.find(user => user.userId === user1.authUserId);
    expect(updatedUser.email).toEqual('smith.hayden@unsw.edu.au');
    expect(updatedUser.nameFirst).toEqual('Smith');
    expect(updatedUser.nameLast).toEqual('Hayden');
  });      

});    


/**
 * Test for adminUserPasswordUpdate Function working properly
 */
describe('adminUserPasswordUpdate', () => {

  // beforeEach(() => {
  //   clear();
  // });


  

});    
    