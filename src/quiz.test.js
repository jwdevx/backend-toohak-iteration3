import { adminQuizCreate } from "./quiz";
import { getData, setData } from "./dataStore";
import { clear } from "./other";
import { adminAuthRegister } from "./auth";
describe('Testing create quizzes return quiz id', () => {
    test('add one quiz', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'to ny123';
        const description = 'test1';
        const id = adminQuizCreate(authUserId, name, description);
        expect(id).toStrictEqual({ quizId: expect.any(Number),})
    })
    test('invalid user id', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC!@# ';
        const description = 'test1';
        const id = adminQuizCreate(authUserId, name, description);
        expect(id).toStrictEqual({ error: 'The user id is not valid.', })
        
    })
    test('invalid name', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'WOjiaoZC!@# ';
        const description = 'test1';
        const id = adminQuizCreate(authUserId, name, description);
        expect(id).toStrictEqual({ error: 'The name is not valid.', })
    })
    test('short name', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'to';
        const description = 'test1';
        const id = adminQuizCreate(authUserId, name, description);
        expect(id).toStrictEqual({ error: "The name is either too long or too short."})
    })
    test('long name', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'qqqqwwwweeeerrrrttttyyyyuuuuuuiiiiiooooppppllll';
        const description = 'test';
        const id = adminQuizCreate(authUserId, name, description);
        expect(id).toStrictEqual({ error: "The name is either too long or too short.",})
    })
    test('name is used', () => {
        clear();
        const data = getData();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'tony';
        const description = 'test1';
        const id1 = adminQuizCreate(authUserId, name, description);
        const id2 = adminQuizCreate(authUserId, name, description);
        expect(id2).toStrictEqual({ error: 'The quiz name is already been used.',})
    })
    test('long description', () => {
        clear();
        const authUserId = adminAuthRegister('tony@gmail.com', 'WOjiaoZC123', 'zeng', 'cheng');
        const name = 'tony';
        const description = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
        const id = adminQuizCreate(authUserId, name, description);
        expect(id).toStrictEqual({ error: 'The description is too long.',})
    })
})