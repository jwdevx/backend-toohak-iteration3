// TODO Implement functions for the following:
/*
/v1/admin/quiz/{quizid}/question
/v1/admin/quiz/{quizid}/question/{questionid}
/v1/admin/quiz/{quizid}/question/{questionid}
/v1/admin/quiz/{quizid}/question/{questionid}/move
/v1/admin/quiz/{quizid}/question/{questionid}/duplicate
*/

import { Questions, ErrorObject, Answer, QuestionBody } from "./dataStore";
import { findSessionId, checkQuestionLength,
findQuizId, matchQuizIdAndAuthor, checkQuestionDuration, checkQuestionPoints, checkAnswerLength, checkQuestionDurationSum, checkAnswerNum, checkAnswerDuplicate, checkAnswerCorrect } from "./helper";
export function adminQuestionCreate(
  token: string, 
  quizId: number,
  questionbody: QuestionBody) : {questionId: number} | ErrorObject {
  
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
  const authUserId = validToken.userId
  const quiz = findQuizId(quizId)
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 401};
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.' , status: 403};
  }
  if (checkQuestionLength(questionbody.question)) {
    return {error: 'The question length is either too long or too short.', status: 400}
  }
  if (checkAnswerNum(questionbody.answers)) {
    return {error: 'The answers is either too much or too little.', status: 400}
  }
  if (checkQuestionDuration(questionbody.duration)) {
    return {error: 'The duration should be positive number', status: 400}
  }
  if (checkQuestionDurationSum(quizId, questionbody.duration)) {
    return {error: 'The sum of the duration should be less than 3 min', status: 400}
  }
  if (checkQuestionPoints(questionbody.points)) {
    return {error: 'The points is either too high or too low', status: 400}
  }  
  if (checkAnswerLength(questionbody.answers)) {
    return {error: 'Answer string should be longer than 1 charcters, shorter than 30 charcters', status: 400}
  }
  if (checkAnswerDuplicate(questionbody.answers)) {
    return {error: 'An answer is a duplicate of the other', status: 400}
  }
  if (checkAnswerCorrect(questionbody.answers)) {
    return {error: 'There should be at least one correct answer.', status: 400}
  }
  const answers: Answer[] = []
  let id = 0
  for (const answer of questionbody.answers) {
    const new_answer : Answer = {
      answerId: id,
      answer: answer.answer,
      correct: answer.correct,
    }
    answers.push(new_answer)
    id++
  }
  const quesitons: Questions = {
    questionId: quiz.questions.length,
    question: questionbody.question,
    duration: questionbody.duration,
    points: questionbody.points,
    answers: answers
  }
  quiz.questions.push(quesitons)
  return { questionId: id }
}