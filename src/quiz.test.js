import { adminQuizCreate } from "./quiz";
import { getData, setData } from "./dataStore";
import { clear } from "./other";
import { adminAuthRegister, adminAuthLogin } from "./auth";
const ERROR = { error: expect.any(String) };
beforeEach(() => {
    clear();
  });
describe('Testing create quizzes return quiz id', () => {
    test('add one quiz', () => {
        clear();
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const id = adminAuthLogin('tony@gmail.com', 'WOjiaoZC123');
        const name = 'to ny123';
        const description = 'test1';
        const quizid = adminQuizCreate(authUser.authUserId, name, description);
        expect(quizid).toStrictEqual({ quizId: expect.any(Number),})
    })
    test('invalid user id', () => {
        clear();
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC';
        const description = 'test1';
        const id = adminQuizCreate(authUser.authUserId + 1, name, description);
        expect(id).toStrictEqual({error: 'The user id is not valid.'})
    })
    test('invalid name', () => {
        clear();
        const authUser = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC!@#?/aas1< ';
        const description = 'test1';
        const id = adminQuizCreate(authUser.authUserId, name, description);
        expect(id).toStrictEqual({error: 'The name is not valid.'})
    })
    test('short name', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'to';
        const description = 'test1';
        const id = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id).toStrictEqual({error: "The name is either too long or too short."})
    })
    test('long name', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'qqqqwwwweeeerrrrttttyyyyuuuuuuiiiiiooooppppllll';
        const description = 'test';
        const id = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id).toStrictEqual({ error: "The name is either too long or too short.",})
    })
    test('name is used', () => {
        clear();
        const data = getData();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'tony';
        const description = 'test1';
        const id1 = adminQuizCreate(authUserId.authUserId, name, description);
        const id2 = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id2).toStrictEqual({error: 'The quiz name is already been used.'})
    })
    test('long description', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'tony';
        const description = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
        const id = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id).toStrictEqual({error: 'The description is too long.'})
    })
    test('name is empty', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = '';
        const description = 'test1';
        const id = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id).toStrictEqual({error: 'The name is empty.'})
    })
    test('description is empty', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        console.log(authUserId);
        const authId = adminAuthLogin('tony@gmail.com', 'WOjiaoZC123');
        console.log(authId);
        const name = 'aaasss';
        const description = '';
        const id = adminQuizCreate(authUserId.authUserId, name, description);
        expect(id).toStrictEqual({error: 'The description is empty.'});
    })
})