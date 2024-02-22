
1531, Crunchie H17B
Data.md - worth 20% of Iteration 0

/**
 * Valid for Register new account and log-in
 * 1. Array of objects for quiz makers
 */

const user = [
    {
    userId: 1,
    nameFirst: 'UserFirstName',
    nameLast: 'UserLastName',
    email: 'adminuser@gmail.com',
    password: "############",
    numSuccessfulLogins: 3,
    numFailedPasswordsSinceLastLogin: 1,
    quizId:[1, 2],
    }
],

/**
 * 2. Aray of object of quizzes
 * 
 */  
const Quiz = {
    quizId: 1,
    quizName: 'My Quiz',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',  
    questions: [
       {
            questionid: '1',
            questionDescription: 'Who is the COMP1531 Lecturer',
            answerA: 'Hayden',
            answerB: 'Jake',
            answerC: 'Yuchao',
            answerD: 'Robert',            
            questionAnswer: 'A',

       },
       {
            questionid: '2',
            questionDescription: 'Question 2',
            answerA: 'A',
            answerB: 'B',
            answerC: 'C',
            answerD: 'D',            
            questionAnswer: 'C',

       },             
    ],
};

