import { adminQuizCreate, adminQuizList,adminQuizNameUpdate,adminQuizDescriptionUpdate } from "./quiz";
import { getData, setData } from "./dataStore";
import { clear } from "./other";
import { adminAuthRegister, adminAuthLogin } from "./auth";
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
        const data = getData();
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
    test('description is empty', () => {
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'aaasss';
        const description = '';
        const id = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id).toStrictEqual({error: 'One or more missing parameters'});
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
        adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizList(authUser.authUserId)).toStrictEqual({
            quizzes: expect.any(Array),
        });
    })
    test('two quizzes are in the list', () => {
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        let name = 'test1';
        let description = 'test1';
        adminQuizCreate(authUser.authUserId, name, description);
        name = 'test2';
        description = 'test2';
        adminQuizCreate(authUser.authUserId, name, description);
        expect(adminQuizList(authUser.authUserId)).toStrictEqual({
            quizzes: expect.any(Array),
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
        expect(adminQuizList(authUser2.authUserId)).toStrictEqual({
            error: 'The user does not own any quizzes.',
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
        const data = getData();
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

