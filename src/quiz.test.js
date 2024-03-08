import { adminQuizCreate, adminQuizList,adminQuizInfo,adminQuizRemove,adminQuizNameUpdate,adminQuizDescriptionUpdate } from "./quiz";
import { clear } from "./other";
import { adminAuthRegister, adminAuthLogin } from "./auth";
import { format } from "date-fns";

const ERROR = { error: expect.any(String) };
describe('Testing create quizzes return quiz id', () => {
  beforeEach(() => {
    clear();
  });
  test('add one quiz', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const id = adminAuthLogin('tony@gmail.com', 'WOjiaoZC123');
    const name = 'to ny123';
    const description = 'test1';
    const quizid = adminQuizCreate(authUser.authUserId, name, description);
    expect(quizid).toStrictEqual({ quizId: expect.any(Number),})
  })
  test('invalid user id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    const id = adminQuizCreate(authUser.authUserId + 1, name, description);
    expect(id).toStrictEqual({error: 'The user id is not valid.'})
  })
  test('invalid name', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC!@#?/aas1< ';
    const description = 'test1';
    const id = adminQuizCreate(authUser.authUserId, name, description);
    expect(id).toStrictEqual({error: 'The name is not valid.'})
  })
  test('short name', () => {
    const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'to';
    const description = 'test1';
    const id = adminQuizCreate(authUserId.authUserId, name, description);
    expect(id).toStrictEqual({error: "The name is either too long or too short."})
  })
  test('long name', () => {
    const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'qqqqwwwweeeerrrrttttyyyyuuuuuuiiiiiooooppppllll';
    const description = 'test';
    const id = adminQuizCreate(authUserId.authUserId, name, description);
    expect(id).toStrictEqual({ error: "The name is either too long or too short.",})
  })
  test('name is used', () => {
    const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'tony';
    const description = 'test1';
    const id1 = adminQuizCreate(authUserId.authUserId, name, description);
    const id2 = adminQuizCreate(authUserId.authUserId, name, description);
    expect(id2).toStrictEqual({error: 'The quiz name is already been used.'})
  })
  test('long description', () => {
    const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'tony';
    const description = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
    const id = adminQuizCreate(authUserId.authUserId, name, description);
    expect(id).toStrictEqual({error: 'The description is too long.'})
  })
  test('name is empty', () => {
    const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = '';
    const description = 'test1';
    const id = adminQuizCreate(authUserId.authUserId, name, description);
    expect(id).toStrictEqual({error: 'One or more missing parameters'})
  })
})
describe('Testing print quiz list return quizzes', () => {
  beforeEach(() => {
    clear();
  });
  test('invalid user id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizList(authUser.authUserId + 1)).toStrictEqual({error: 'The user id is not valid.'});
  })
  test('invalid user id', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const name = 'WOjiaoZC';
    const description = 'test1';
    adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizList()).toStrictEqual({error: 'One or more missing parameters'});
  })
  test('correct input', () => {
    const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    let name = 'test1';
    let description = 'test1';
    const quiz = adminQuizCreate(authUser.authUserId, name, description);
    expect(adminQuizList(authUser.authUserId)).toStrictEqual({
      quizzes: [
        {
          quizId: expect.any(Number),
          name: expect.any(String),
        },
      ]
    });
  })
  test('user does not have any quizzes', () => {
    const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    const authUser2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
    let name = 'test1';
    let description = 'test1';
    adminQuizCreate(authUser1.authUserId, name, description);
    name = 'test2';
    description = 'test2';
    adminQuizCreate(authUser1.authUserId, name, description);
    console.log(adminQuizList(authUser2.authUserId));
    expect(adminQuizList(authUser2.authUserId)).toStrictEqual({
      quizzes: [],
    });
  })    
})
describe('Testing if adminQuizInfo prints the correct information', () => {
    beforeEach(() => {
        clear();
    });
    test('invalid user id', () => {
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC';
        const description = 'test1';
        const quizId = adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizInfo(authUser.authUserId + 1, quizId)).toStrictEqual({error: 'The user id is not valid.'});
    })
    test('invalid quiz id', () => {
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC';
        const description = 'test1';
        let quizId = adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizInfo(authUser.authUserId, quizId + 1)).toStrictEqual({error: 'Quiz ID does not refer to a valid quiz.'});
    })   
    test('Quiz ID does not refer to a quiz that this user owns.', () => {
        const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const authUser2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
        let name1 = 'test1';
        let description1 = 'test1';
        let quizobj1 = adminQuizCreate(authUser1.authUserId, name1, description1);
        let name2 = 'test2';
        let description2 = 'test2';
        let quizobj2 = adminQuizCreate(authUser2.authUserId, name2, description2);
        let quizId2 = quizobj2.quizId;
        let quizId1 = quizobj1.quizId;
        expect(adminQuizInfo(authUser2.authUserId, quizId1)).toStrictEqual({error: 'Quiz ID does not refer to a quiz that this user owns.'});
        expect(adminQuizInfo(authUser1.authUserId, quizId2)).toStrictEqual({error: 'Quiz ID does not refer to a quiz that this user owns.'});
      })
    test('Matching correct info', () => {
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        let name = 'test1';
        let description = 'testing';
        const IDobj = adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizInfo(authUser.authUserId, IDobj.quizId)).toStrictEqual({
          quizId: IDobj.quizId, name: 'test1', timeCreated: format(new Date(), "MMMM d, yyyy h:mm a"), timeLastEdited: format(new Date(), "MMMM d, yyyy h:mm a"), description: 'testing'
        });
    })
    
})
describe('Testing if adminQuizRemove successfully removes the given quiz', () => {
    beforeEach(() => {
        clear();
    });
    test('invalid user id', () => {
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC';
        const description = 'test1';
        const quizId = adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizRemove(authUser.authUserId + 1, quizId)).toStrictEqual({error: 'The user id is not valid.'});
    })
    test('invalid quiz id', () => {
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC';
        const description = 'test1';
        let quizId = adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizRemove(authUser.authUserId, quizId + 1)).toStrictEqual({error: 'Quiz ID does not refer to a valid quiz.'});
    })
    test('Quiz ID does not refer to a quiz that this user owns.', () => {
        const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const authUser2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
        let name1 = 'test1';
        let description1 = 'test1';
        let quizobj1 = adminQuizCreate(authUser1.authUserId, name1, description1);
        let name2 = 'test2';
        let description2 = 'test2';
        let quizobj2 = adminQuizCreate(authUser2.authUserId, name2, description2);
        let quizId2 = quizobj2.quizId;
        let quizId1 = quizobj1.quizId;
        expect(adminQuizRemove(authUser2.authUserId, quizId1)).toStrictEqual({error: 'Quiz ID does not refer to a quiz that this user owns.'});
    })
    test('Successfully removed a quiz', () => {
        const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const authUser2 = adminAuthRegister('jason@gmail.com', 'WOjiaoZC123', 'jason', 'cheng');
        let name1 = 'test1';
        let description1 = 'test1';
        let quizobj1 = adminQuizCreate(authUser1.authUserId, name1, description1);
        let name2 = 'test2';
        let description2 = 'test2';
        let quizobj2 = adminQuizCreate(authUser2.authUserId, name2, description2);
        let quizId2 = quizobj2.quizId;
        let quizId1 = quizobj1.quizId;
        adminQuizRemove(authUser2.authUserId, quizId2);
        expect(adminQuizInfo(authUser2.authUserId, quizId2)).toStrictEqual({error: 'Quiz ID does not refer to a valid quiz.'});
    })
    test('Successfully removed multiple quizzes', () => {
      const authUser1 = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
      let name1 = 'test1';
      let description1 = 'test1';
      let quizobj1 = adminQuizCreate(authUser1.authUserId, name1, description1);

      let name2 = 'test2';
      let description2 = 'test2';
      let quizobj2 = adminQuizCreate(authUser1.authUserId, name2, description2);

      let name3 = 'test3';
      let description3 = 'test3';
      let quizobj3 = adminQuizCreate(authUser1.authUserId, name3, description3);

      let quizId2 = quizobj2.quizId;
      let quizId1 = quizobj1.quizId;
      let quizId3 = quizobj3.quizId;

      adminQuizRemove(authUser1.authUserId, quizId1);
      adminQuizRemove(authUser1.authUserId, quizId2);
      adminQuizRemove(authUser1.authUserId, quizId3);

      expect(adminQuizList(authUser1.authUserId)).toStrictEqual({
        quizzes: [],
      });
  })
})


describe('Testing QuizNameUpdate', () => {
    beforeEach(() => {
        clear();
    });

    //Testing for AuthuserId is not a valid user
    test('invalid user id', () => {
        const authUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'BdDhK';
        const name2 = 'sami';
        const description = 'test2';
        const QuizCrt = adminQuizCreate(authUser.authUserId , name, description);
        const Update=adminQuizNameUpdate(authUser.authUserId +1,QuizCrt.quizId,name2);
        expect(Update).toStrictEqual({error: 'The user id is not valid.'});
    })

    //Testing for QuizId validity
    test('QuizId does not belong to user', () => { 
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const description = 'test1';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId+1, name);
        expect(Update).toStrictEqual({error: 'The quiz id is not valid.'});
    })

    //Testing for quiz ownership
    test('QuizId does not belong to user', () => { 
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const autherUser1 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque');
        const name = 'sami';
        const description = 'test1';
        const name2 = 'Tumi';
        const name3 = 'Amra';
        const description2 = 'test2';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const QuizCrt2 = adminQuizCreate(autherUser1.authUserId, name2, description2);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt2.quizId, name3);
        expect(Update).toStrictEqual({error: 'Quiz belongs to a different user.'});


    })

    //Testing for name is not alphanumeric
    test('invalid name', () => {
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const name2 = 'BdDhk!@#?/iter1< ';
        const description = 'test2';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId, name2);
        expect(Update).toStrictEqual({error: 'The name is not valid.'})
    })

    //Testing for name is too short
    test('short name', () => {
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const name2 = 'hi';
        const description = 'test2';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId, name2);
        expect(Update).toStrictEqual({error: "The name is either too long or too short."})
    })

    //Testing for name is too long
    test('long name', () => {
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const name2 = 'hhhheeeeeeeeeeelllllllllllllllloooooooooooooooooo';
        const description = 'test2';
        const QuizCrt= adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId, name2);
        expect(Update).toStrictEqual({ error: "The name is either too long or too short.",})
    })

    //Testing for invalid name input
    test('name is empty', () => {
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const name2='';
        const description = 'test1';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId, name2);
        expect(Update).toStrictEqual({error: 'The name is either too long or too short.'})
    })
    
    //Testing for if the name is used by other user
    test('name is used', () => {
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const name2='ami';
        const description = 'test2';
        const description2='test1';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const QuizCrt2 = adminQuizCreate(autherUser.authUserId, name2, description2);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId, name2);
        expect(Update).toStrictEqual({error: 'The quiz name is already been used.'})
    })

    //Testing for correct input and output
    test('Correct input', () => { 
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const name2='ami';
        const description = 'test2';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizNameUpdate(autherUser.authUserId,QuizCrt.quizId, name2);
        expect(Update).toStrictEqual({});


    })

})


describe('Testing QuizDescriptionUpdate', () => {
    beforeEach(() => {
        clear();
    });

    //Testing for AuthuserId is not a valid user
    test('invalid user id', () => {
        const authUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'BdDhK';
        const description = 'test2';
        const description2 = 'test1';
        const QuizCrt = adminQuizCreate(authUser.authUserId , name, description);
        const Update =adminQuizDescriptionUpdate(authUser.authUserId +1,QuizCrt.quizId,description2)
        expect(Update).toStrictEqual({error: 'The user id is not valid.'})
    })


       //Testing for QuizId validity
       test('QuizId does not belong to user', () => { 
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const description = 'test1';
        const description2 = 'test2';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizDescriptionUpdate(autherUser.authUserId,QuizCrt.quizId +1,description2);
        expect(Update).toStrictEqual({error: 'The quiz id is not valid.'});
    })

    //Testing for quiz ownership
    test('QuizId does not belong to user', () => { 
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const autherUser1 = adminAuthRegister('ami@gmail.com', 'BnGBd123', 'ami', 'ishfaque');
        const name = 'sami';
        const description = 'test1';
        const name2 = 'ami';
        const description2 = 'test2';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const QuizCrt2 = adminQuizCreate(autherUser1.authUserId, name2, description2);
        const Update=adminQuizDescriptionUpdate(autherUser.authUserId,QuizCrt2.quizId,description2);
        expect(Update).toStrictEqual({error: 'Quiz belongs to a different user.'});


    })

    //Testing for too long description
    test('long description', () => {
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'BdDhk';
        const description = 'test2';
        const description2 = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update =adminQuizDescriptionUpdate(autherUser.authUserId,QuizCrt.quizId,description2)
        expect(Update).toStrictEqual({error: 'The description is too long.'})
    })

       //Testing for correct input and output
       test('Correct input', () => { 
        const autherUser = adminAuthRegister('sami@yahoo.com', 'DhkBD123', 'sami', 'ashfaque');
        const name = 'sami';
        const description = 'test2';
        const description2 = 'test1';
        const QuizCrt = adminQuizCreate(autherUser.authUserId, name, description);
        const Update=adminQuizDescriptionUpdate(autherUser.authUserId,QuizCrt.quizId,description2);
        expect(Update).toStrictEqual({});


    })


})

