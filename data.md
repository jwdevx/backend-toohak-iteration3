/*
1531, Crunchie H17B
Data.md - worth 20% of Iteration 0

*/


/**
 * Valid for Register new account and log-in
 * 1. Array of objects for quiz makers
 */

const users = [
  {
    userId: 1,
    nameFirst: 'UserFirstName',
    nameLast: 'UserLastName',
    email: 'adminuser@gmail.com',
    password: "##########",
    numSuccessfulLogins: 3,
    numFailedPasswordsSinceLastLogin: 1,
    quizIds: [1, 2], // Array of quiz IDs associated with the user
  },
  // ... other users
];

/**
 * 2. Aray of object of quizzes
 * 
 */  
const quizzes = [
  {
    quizId: 1,
    quizName: 'My Quiz 1',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'Mini Quiz COMP1531',
    questions: [
      {
        questionId: 1,
        questionDescription: 'Who is the COMP1531 Lecturer?',
        answerOptions: {
            a: 'Hayden',
            b: 'Jake',
            c: 'Yuchao',
            d: 'Robert'
        },          
        correctAnswer: 'a',
      },
      {
        questionId: 2,
        questionDescription: 'What is the capital of France?',
        answerOptions: {
            a: 'Berlin',
            b: 'Madrid',
            c: 'Paris',
            d: 'London'
        },            
        correctAnswer: 'c',

      },
    ],
  },
  {
    quizId: 2,
    quizName: 'My Quiz 2',
    timeCreated: 1683125872,
    timeLastEdited: 1683125873,
    description: 'Description of Quiz 2',
    questions: [
    // ... questions for Quiz 2
    ],
  },
  // ... other quizzes
];