const Colour = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
import { Questions, Answer, QuestionBody, QuestionBodyV2 } from './dataStore';
import {
  findSessionId, checkQuestionLength, findQuizId, matchQuizIdAndAuthor,
  checkQuestionDuration, checkQuestionPoints, checkAnswerLength,
  checkQuestionDurationSum, checkAnswerNum, checkAnswerDuplicate,
  checkAnswerCorrect, randomIdGenertor, getNow, isValidUrl
} from './helper';
import HTTPError from 'http-errors';

/**
 * creates a quiz question.
 * @param {string} token - a valid sessionId
 * @param {number} quizId - the authenticated user ID
 * @param {QuestionBody} questionBody - an object of interface QuestionBody
 * @returns {questionId: number}
 */
export function adminQuestionCreate(
  token: string,
  quizId: number,
  questionBody: QuestionBody) : {questionId: number} {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  if (checkQuestionLength(questionBody.question)) {
    throw HTTPError(400, 'The question length is either too long or too short.');
  }
  if (checkAnswerNum(questionBody.answers)) {
    throw HTTPError(400, 'The answers is either too much or too little.');
  }
  if (checkQuestionDuration(questionBody.duration)) {
    throw HTTPError(400, 'The duration should be positive number');
  }
  if (checkQuestionDurationSum(quizId, questionBody.duration)) {
    throw HTTPError(400, 'The sum of the duration should be less than 3 min');
  }
  if (checkQuestionPoints(questionBody.points)) {
    throw HTTPError(400, 'The points is either too high or too low');
  }
  if (checkAnswerLength(questionBody.answers)) {
    throw HTTPError(400, 'Answer string should be longer than 1 charcters, shorter than 30 charcters');
  }
  if (checkAnswerDuplicate(questionBody.answers)) {
    throw HTTPError(400, 'An answer is a duplicate of the other');
  }
  if (checkAnswerCorrect(questionBody.answers)) {
    throw HTTPError(400, 'There should be at least one correct answer.');
  }
  // Success 200
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
    answers: answers,
    thumbnailUrl: '',
  };
  quiz.duration += questionBody.duration;
  quiz.timeLastEdited = getNow();
  quiz.numQuestions += 1;
  quiz.questions.push(quesiton);
  return { questionId: quesiton.questionId };
}

/**
 * creates a quiz questionV2 specific for iteration 3
 */
export function adminQuestionCreateV2(
  token: string,
  quizId: number,
  questionBody: QuestionBodyV2) : {questionId: number} {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(400, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  if (checkQuestionLength(questionBody.question)) {
    throw HTTPError(400, 'The question length is either too long or too short.');
  }
  if (checkAnswerNum(questionBody.answers)) {
    throw HTTPError(400, 'The answers is either too much or too little.');
  }
  if (checkQuestionDuration(questionBody.duration)) {
    throw HTTPError(400, 'The duration should be positive number');
  }
  if (checkQuestionDurationSum(quizId, questionBody.duration)) {
    throw HTTPError(400, 'The sum of the duration should be less than 3 min');
  }
  if (checkQuestionPoints(questionBody.points)) {
    throw HTTPError(400, 'The points is either too high or too low');
  }
  if (checkAnswerLength(questionBody.answers)) {
    throw HTTPError(400, 'Answer string should be longer than 1 charcters, shorter than 30 charcters');
  }
  if (checkAnswerDuplicate(questionBody.answers)) {
    throw HTTPError(400, 'An answer is a duplicate of the other');
  }
  if (checkAnswerCorrect(questionBody.answers)) {
    throw HTTPError(400, 'There should be at least one correct answer.');
  }
  //
  const url: string = questionBody.thumbnailUrl;
  if (!isValidUrl(url)) throw HTTPError(400, 'The url is not valid.');

  // Success 200
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
    answers: answers,
    thumbnailUrl: questionBody.thumbnailUrl
  };
  quiz.duration += questionBody.duration;
  quiz.timeLastEdited = getNow();
  quiz.numQuestions += 1;
  quiz.questions.push(quesiton);
  return { questionId: quesiton.questionId };
}

/**
 * Moves a quiz question.
 * @param {number} quizId - the authenticated quiz ID
 * @param {number} questionId - the authenticated question ID
 * @param {string} token - an encoded string containing the session ID.
 * @param {QuestionBody} questionBody - an object of interface QuestionBody
 * @returns {}
 */
export function adminQuestionUpdate(
  token: string,
  quizId: number,
  questionId:number,
  questionBody: QuestionBody) : Record<string, never> {
  // 1.Error 401 - check Token
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403 - check Quiz
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400 - check Error Questions
  if (checkQuestionPoints(questionBody.points)) {
    throw HTTPError(400, 'The points is either too high or too low');
  }
  if (checkQuestionLength(questionBody.question)) {
    throw HTTPError(400, 'The question length is either too long or too short.');
  }
  if (checkQuestionDuration(questionBody.duration)) {
    throw HTTPError(400, 'The duration should be positive number');
  }
  const srcQuestion = quiz.questions.find(question => question.questionId === questionId);
  if (!srcQuestion) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }
  // Check if adding the new question exceed 180 then error, if not then we update
  const possibleNewDuration = quiz.duration - srcQuestion.duration + questionBody.duration;
  if (possibleNewDuration > 180) {
    throw HTTPError(400, 'The sum of the duration should be less than 3 min');
  }
  // Check Error Answers
  if (checkAnswerLength(questionBody.answers)) {
    throw HTTPError(400, 'Answer string should be longer than 1 charcters, shorter than 30 charcters');
  }
  if (checkAnswerDuplicate(questionBody.answers)) {
    throw HTTPError(400, 'An answer is a duplicate of the other');
  }
  if (checkAnswerCorrect(questionBody.answers)) {
    throw HTTPError(400, 'There should be at least one correct answer.');
  }
  if (checkAnswerNum(questionBody.answers)) {
    throw HTTPError(400, 'The answers is either too much or too little.');
  }

  // Success 200 - updating Source question
  srcQuestion.question = questionBody.question;
  srcQuestion.points = questionBody.points;
  srcQuestion.duration = questionBody.duration;

  // Update answers from questionBody
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
  srcQuestion.answers = answers;

  // Update Quiz
  quiz.duration = possibleNewDuration;
  quiz.timeLastEdited = getNow();
  return {};
}

/**
 * V2 iteration 2 specific
 */
export function adminQuestionUpdateV2(
  token: string,
  quizId: number,
  questionId:number,
  questionBody: QuestionBodyV2) : Record<string, never> {
  // 1.Error 401 - check Token
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403 - check Quiz
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }

  // 3.Error 400 - check Error Questions
  if (checkQuestionPoints(questionBody.points)) {
    throw HTTPError(400, 'The points is either too high or too low');
  }
  if (checkQuestionLength(questionBody.question)) {
    throw HTTPError(400, 'The question length is either too long or too short.');
  }
  if (checkQuestionDuration(questionBody.duration)) {
    throw HTTPError(400, 'The duration should be positive number');
  }
  const srcQuestion = quiz.questions.find(question => question.questionId === questionId);
  if (!srcQuestion) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  // Check if adding the new question exceed 180 then error, if not then we update
  const possibleNewDuration = quiz.duration - srcQuestion.duration + questionBody.duration;
  if (possibleNewDuration > 180) {
    throw HTTPError(400, 'The sum of the duration should be less than 3 min');
  }
  // Check Error Answers
  if (checkAnswerLength(questionBody.answers)) {
    throw HTTPError(400, 'Answer string should be longer than 1 charcters, shorter than 30 charcters');
  }
  if (checkAnswerDuplicate(questionBody.answers)) {
    throw HTTPError(400, 'An answer is a duplicate of the other');
  }
  if (checkAnswerCorrect(questionBody.answers)) {
    throw HTTPError(400, 'There should be at least one correct answer.');
  }
  if (checkAnswerNum(questionBody.answers)) {
    throw HTTPError(400, 'The answers is either too much or too little.');
  }
  //
  const url: string = questionBody.thumbnailUrl;
  if (!isValidUrl(url)) throw HTTPError(400, 'The url is not valid.');

  // Success 200 - updating Source question
  srcQuestion.question = questionBody.question;
  srcQuestion.points = questionBody.points;
  srcQuestion.duration = questionBody.duration;

  // Update answers from questionBody
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
  srcQuestion.answers = answers;

  // Update Quiz
  quiz.duration = possibleNewDuration;
  quiz.timeLastEdited = getNow();
  return {};
}

/**
 * deletes a quiz question.
 * @param {number} quizId - the authenticated user ID
 * @param {number} questionId - the authenticated user ID
 * @param {string} token - a valid sessionId.
 * @returns {}
 */
export function adminQuestionRemove(
  quizId: number,
  questionId: number,
  token: string): Record<string, never> {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const authUserId = validToken.userId;
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);
  if (questionIndex === -1) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }
  // Success 200
  const duration = quiz.questions[questionIndex].duration;
  quiz.questions.splice(questionIndex, 1);
  quiz.duration -= duration;
  quiz.numQuestions -= 1;
  return {};
}

/**
 * Moves a quiz question.
 * @param {number} quizId - the authenticated quiz ID
 * @param {number} questionId - the authenticated question ID
 * @param {string} token - an encoded string containing the session ID.
 * @param {number} newPosition- an index where we wish to move this question to
 * @returns {}
 */
export function adminQuestionMove(
  quizId: number,
  questionId: number,
  token: string,
  newPosition: number): Record<string, never> {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);
  if ((newPosition > quiz.numQuestions - 1) || (newPosition < 0) || (newPosition === questionIndex)) {
    throw HTTPError(400, 'Not a valid new position.');
  }
  if (questionIndex === -1) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }
  // Success 200
  const [movedQuestion] = quiz.questions.splice(questionIndex, 1);
  quiz.questions.splice(newPosition, 0, movedQuestion);
  quiz.timeLastEdited = getNow();
  return {};
}

/**
 * creates a quiz question.
 * @param {string} token - a valid sessionId
 * @param {number} quizId - the authenticated user ID
 * @param {number} questionId - the authenticated question ID
 * @returns {questionId: number}
 */
export function adminQuestionDuplicate(
  token: string,
  quizId: number,
  questionId: number) : {questionId: number} {
  // 1.Error 401
  const sessionId = parseInt(decodeURIComponent(token));
  if (!token || isNaN(sessionId) || !String(token).trim()) {
    throw HTTPError(401, 'Token is empty or not provided');
  }
  const validToken = findSessionId(sessionId);
  if (!validToken) {
    throw HTTPError(401, 'Token is invalid (does not refer to valid logged in user session)');
  }
  // 2.Error 403
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz.');
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns.');
  }
  // 3.Error 400
  const Question = quiz.questions.find(question => question.questionId === questionId);
  if (!Question) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }
  // Success 200 - duplicate the source question
  const answers: Answer[] = [];
  for (const answer of Question.answers) {
    const newAnswer : Answer = {
      answerId: answer.answerId,
      answer: answer.answer,
      correct: answer.correct,
      colour: Colour[Math.floor(Math.random() * 7)]
    };
    answers.push(newAnswer);
  }
  const id = randomIdGenertor();
  const quesiton: Questions = {
    questionId: id,
    question: Question.question,
    duration: Question.duration,
    points: Question.points,
    answers: answers,
    thumbnailUrl: Question.thumbnailUrl,
  };
  // Update Quiz
  quiz.duration += Question.duration;
  quiz.timeLastEdited = getNow();
  quiz.numQuestions += 1;

  // Insert immeditately after source question
  const sourceIndex = quiz.questions.findIndex(q => q.questionId === questionId);
  quiz.questions.splice(sourceIndex + 1, 0, quesiton);
  return { questionId: quesiton.questionId };
}
