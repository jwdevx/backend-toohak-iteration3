// TODO Implement functions for the following:
/*
/v1/admin/quiz/{quizid}/question
/v1/admin/quiz/{quizid}/question/{questionid}
/v1/admin/quiz/{quizid}/question/{questionid}
/v1/admin/quiz/{quizid}/question/{questionid}/move
/v1/admin/quiz/{quizid}/question/{questionid}/duplicate
*/
const Colour = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
import { Questions, ErrorObject, Answer, QuestionBody } from './dataStore';
import {
  findSessionId, checkQuestionLength,
  findQuizId, matchQuizIdAndAuthor, checkQuestionDuration, checkQuestionPoints, checkAnswerLength, checkQuestionDurationSum, checkAnswerNum, checkAnswerDuplicate, checkAnswerCorrect, randomIdGenertor, getNow
} from './helper';
export function adminQuestionCreate(
  token: string,
  quizId: number,
  questionBody: QuestionBody) : {questionId: number} | ErrorObject {
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    return { error: 'Token is empty or not provided', status: 401 };
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    return {
      error: 'Token is invalid (does not refer to valid logged in user session)', status: 401,
    };
  }
  const authUserId = validToken.userId;
  const quiz = findQuizId(quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 403 };
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  if (checkQuestionLength(questionBody.question)) {
    return { error: 'The question length is either too long or too short.', status: 400 };
  }
  if (checkAnswerNum(questionBody.answers)) {
    return { error: 'The answers is either too much or too little.', status: 400 };
  }
  if (checkQuestionDuration(questionBody.duration)) {
    return { error: 'The duration should be positive number', status: 400 };
  }
  if (checkQuestionDurationSum(quizId, questionBody.duration)) {
    return { error: 'The sum of the duration should be less than 3 min', status: 400 };
  }
  if (checkQuestionPoints(questionBody.points)) {
    return { error: 'The points is either too high or too low', status: 400 };
  }
  if (checkAnswerLength(questionBody.answers)) {
    return { error: 'Answer string should be longer than 1 charcters, shorter than 30 charcters', status: 400 };
  }
  if (checkAnswerDuplicate(questionBody.answers)) {
    return { error: 'An answer is a duplicate of the other', status: 400 };
  }
  if (checkAnswerCorrect(questionBody.answers)) {
    return { error: 'There should be at least one correct answer.', status: 400 };
  }
  const answers: Answer[] = [];
  for (const answer of questionBody.answers) {
    const newAnswer : Answer = {
      answerId: randomIdGenertor(),
      answer: answer.answer,
      correct: answer.correct,
      colour: Colour[Math.floor(Math.random() * 7)]
    };
    answers.push(newAnswer);
  }
  const id = randomIdGenertor();
  const quesiton: Questions = {
    questionId: id,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answers
  };
  quiz.duration += questionBody.duration;
  quiz.timeLastEdited = getNow();
  quiz.questions.push(quesiton);
  return { questionId: quesiton.questionId };
}
