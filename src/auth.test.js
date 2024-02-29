import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate, 
} from './auth.js';

import { clear } from './other.js';

const ERROR = { error: expect.any(String) };
beforeEach(() => {
  clear();
});


/**
 * Assumptions: 
 *   - password won't have emoji
 *   - Only ASCII characters are allowed in passwords.
 *   - no whitespace
 * 
 */
describe('adminAuthRegister', () => {

  beforeEach(() => {
    clear();
  });

  test('Check error message for duplicate existing email', () => {
    let UserId = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    let duplicate = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    expect(duplicate).toStrictEqual(ERROR);    
  });      

  test.each([
    ['invalid_email', '1234abcd', 'Hayden', 'Smith', { error: 'Invalid email address: email is not a string' }],
    ['email.com', '1234abcd', 'Hayden', 'Smith', { error: 'Invalid email address: email is not a string' }],
    ['email@', '1234abcd', 'Hayden', 'Smith', { error: 'Invalid email address: email is not a string' }],
    ['email@hayden', '1234abcd', 'Hayden', 'Smith', { error: 'Invalid email address: email is not a string' }],
    ['hayden@@gmail.com', '1234abcd', 'Hayden', 'Smith', { error: 'Invalid email address: email is not a string' }],
    ['hay?den@[192.168.1.1]', '1234abcd', 'Hayden', 'Smith', { error: 'Invalid email address: email is not a string' }]
  ])('("%s") does not satify validator.isEmail function', (email, password, nameFirst, nameLast, expected) => {
    expect(adminAuthRegister(email, password, nameFirst, nameLast)).toStrictEqual(expected);
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




    
    

