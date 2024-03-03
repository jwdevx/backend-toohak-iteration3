import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate, 
} from './auth.js';

import { clear } from './other.js';
import { getData } from './dataStore.js';
const ERROR = { error: expect.any(String) };



let ExampleUser;
let ExampleUser2;



  
describe('These are tests for adminAuthLogin', () => {
  beforeEach(() => {
    ExampleUser = adminAuthRegister('samsmith@gmail.com', 'IS1234567', 'Sam', 'Smith');
    ExampleUser2 = adminAuthRegister('kingjakerulesdaworld1@gmail.com', '1234567', 'jamie', 'cheong');
  });
  
  
    // NON EXISTENT EMAIL
    test('Error Case: Email address does not exist', () => {
        expect(adminAuthLogin('notemail@gmail.com', '123456')).toStrictEqual({error: expect.any(String)});
    });

    // WRONG PWD
    test('Error Case: Password is not correct for given email', () => {
        expect(adminAuthLogin('samsmith@gmail.com', '1234567')).toStrictEqual({error: expect.any(String)});
    });

    // NULL CASE
    test('Error Case: Null argument', () => {
        expect(adminAuthLogin()).toStrictEqual({ error: expect.any(String)});
    });

    // SUCCESS CASE
    test('Success case: Prints user ID', () => {
        expect(adminAuthLogin('samsmith@gmail.com', 'IS1234567')).toStrictEqual({ authUserId: expect.any(Number) });
    });
});

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
    expect(NameFirst1).toStrictEqual({ error: 'First name contains invalid characters' });
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
    expect(NameLast1).toStrictEqual({ error: 'Last name contains invalid characters' });
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
 * Test for adminUserDetails Function working properly
 */



describe('These are tests for adminUserDetails', () => { 
  beforeEach(() => {
    clear ();
  });
  test('Edge Case: Invalud authUserId', () => {
      expect(adminUserDetails('256')).toStrictEqual({error: expect.any(String)})
  })

  test('Edge Case: Empty authUserId', () => {
      expect(adminUserDetails('')).toStrictEqual({error: expect.any(String)})
  })

  test('Success Case: Fetch user details', () => {
      // 1. Use adminAuthRegister to create a user and get the authUserId
      const registrationResult = adminAuthRegister('test@example.com', 'ValidPassword1', 'Johnny', 'Depp');

      // 2. Check if the registration was successful (no error)
      expect(registrationResult).not.toHaveProperty('error');
      const authUserId = registrationResult.authUserId;

      // 3. Use adminUserDetails to fetch user details using the authUserId
      const userDetails = adminUserDetails(authUserId);

      // 4. Assert that user details are as expected
      expect(userDetails).toEqual({
        user: {
          userId: authUserId,
          name: 'Johnny Depp',
          email: 'test@example.com',
          numSuccessfulLogins: expect.any(Number),
          numFailedPasswordsSinceLastLogin: expect.any(Number),
          }
      });
  });
});


  // test('Success Case: Prints user details', () => {
  //     expect(adminUserDetails(authUserId)).toStrictEqual({
  //     user: {
  //         userId: expect.any(Number), 
  //         name: expect.any(String),
  //         email: expect.any(String), 
  //         numSuccessfulLogins: expect.any(Number),
  //         numFailedPasswordsSinceLastLogin: expect.any(Number)
  //         },
  //     });
  // })

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
    expect(NameFirst1).toStrictEqual({ error: 'First name contains invalid characters'});
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
    expect(NameLast1).toStrictEqual({ error: 'Last name contains invalid characters'});
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

  beforeEach(() => {
    clear();
  });
  test('the authId does not exist', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId + 1, '1234abcd', 'WOjiaoZC1');
    expect(error).toStrictEqual({error: 'AuthUserId is not a valid user'});
  });
  test('the old password is wrong', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234aaaa', 'WOjiaoZC1');
    expect(error).toStrictEqual({error: 'The old password is wrong. Please enter the correct password.'});
  })
  test('the new password is the same as the old one', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', '1234abcd');
    expect(error).toStrictEqual({error: 'The new password is the same as the old password. Please enter a new password.'});
  })
  test('the new password is used before', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'WOjiaoZC123');
    const error = adminUserPasswordUpdate(user1.authUserId, 'WOjiaoZC123', '1234abcd');
    expect(error).toStrictEqual({error: 'The new password is used before. Please enter a new password.'});
  })
  test('short password', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', '1234a');
    expect(error).toStrictEqual({error: 'Password must be at least 8 characters long'});
  })
  test('missing number password', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'abncdefgh');
    expect(error).toStrictEqual({error: 'Password must contain at least one letter and one number'});
  })
  test('missing letter password', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    const error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', '12345678');
    expect(error).toStrictEqual({error: 'Password must contain at least one letter and one number'});
  })
  test('correct input', () => {
    let user1 = adminAuthRegister('hayden.smith@unsw.edu.au', '1234abcd', 'Hayden', 'Smith');
    let error = adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'WOjiaoZC123');
    const login = adminAuthLogin('hayden.smith@unsw.edu.au', 'WOjiaoZC123');
    expect(login).toStrictEqual(user1);
  })
})
    