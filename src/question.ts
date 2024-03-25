const Colour = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
import { Questions, ErrorObject, Answer, QuestionBody } from './dataStore';
import {
  findSessionId, checkQuestionLength, findQuizId, matchQuizIdAndAuthor,
  checkQuestionDuration, checkQuestionPoints, checkAnswerLength,
  checkQuestionDurationSum, checkAnswerNum, checkAnswerDuplicate,
  checkAnswerCorrect, randomIdGenertor, getNow
} from './helper';

/**
 * creates a quiz question.
 * @param {string} token - a valid sessionId
 * @param {number} quizId - the authenticated user ID
 * @param {QuestionBody} questionBody - an object of interface QuestionBody
 * @returns {questionId: number} | ErrorObject
 */
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
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 403 };
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
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
 * @returns {} | ErrorObject
 */
export function adminQuestionUpdate(
  token: string,
  quizId: number,
  questionId:number,
  questionBody: QuestionBody) :ErrorObject | Record<string, never> {
  // Check Token
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
  // Check Quiz
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 403 };
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }

  // Check Error Answers
  if (checkAnswerLength(questionBody.answers)) {
    return { error: 'Answer string should be longer than 1 charcters, shorter than 30 charcters', status: 400 };
  }
  if (checkAnswerDuplicate(questionBody.answers)) {
    return { error: 'An answer is a duplicate of the other', status: 400 };
  }
  if (checkAnswerCorrect(questionBody.answers)) {
    return { error: 'There should be at least one correct answer.', status: 400 };
  }
  if (checkAnswerNum(questionBody.answers)) {
    return { error: 'The answers is either too much or too little.', status: 400 };
  }

  // Check Error Questions
  if (checkQuestionPoints(questionBody.points)) {
    return { error: 'The points is either too high or too low', status: 400 };
  }
  if (checkQuestionLength(questionBody.question)) {
    return { error: 'The question length is either too long or too short.', status: 400 };
  }
  if (checkQuestionDuration(questionBody.duration)) {
    return { error: 'The duration should be positive number', status: 400 };
  }
  const srcQuestion = quiz.questions.find(question => question.questionId === questionId);
  if (!srcQuestion) {
    return { error: 'Question Id does not refer to a valid question within this quiz', status: 400 };
  }

  // Check if adding the new question exceed 180 then error, if not then we update
  const possibleNewDuration = quiz.duration - srcQuestion.duration + questionBody.duration;
  if (possibleNewDuration > 180) {
    return { error: 'The sum of the duration should be less than 3 min', status: 400 };
  }
  quiz.duration = possibleNewDuration;

  // Updating Source question
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

  // Update Time
  quiz.timeLastEdited = getNow();
  return {};
}

/**
 * deletes a quiz question.
 * @param {number} quizId - the authenticated user ID
 * @param {number} questionId - the authenticated user ID
 * @param {string} token - a valid sessionId.
 * @returns {} | ErrorObject
 */
export function adminQuestionRemove(
  quizId: number,
  questionId: number,
  token: string): Record<string, never> | ErrorObject {
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
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 403 };
  }
  if (!matchQuizIdAndAuthor(authUserId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }

  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);
  if (questionIndex === -1) {
    return { error: 'Question Id does not refer to a valid question within this quiz', status: 400 };
  }

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
 * @returns {} | ErrorObject
 */
export function adminQuestionMove(
  quizId: number,
  questionId: number,
  token: string,
  newPosition: number) : Record<string, never> | ErrorObject {
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
  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 403 };
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  const questionIndex = quiz.questions.findIndex(question => question.questionId === questionId);
  if ((newPosition > quiz.numQuestions - 1) || (newPosition < 0) || (newPosition === questionIndex)) {
    return { error: 'Not a valid new position.', status: 400 };
  }
  if (questionIndex === -1) {
    return { error: 'Question Id does not refer to a valid question within this quiz', status: 400 };
  }

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
 * @returns {questionId: number} | ErrorObject
 */
export function adminQuestionDuplicate(
  token: string,
  quizId: number,
  questionId: number) : {questionId: number} | ErrorObject {
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

  const quiz = findQuizId(quizId);
  if (!quiz || isNaN(quizId) || quiz.intrash === true) {
    return { error: 'Quiz ID does not refer to a valid quiz.', status: 403 };
  }
  if (!matchQuizIdAndAuthor(validToken.userId, quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns.', status: 403 };
  }
  const Question = quiz.questions.find(question => question.questionId === questionId);
  if (!Question) {
    return { error: 'Question Id does not refer to a valid question within this quiz', status: 400 };
  }

  // Duplicate the source question
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
    answers: answers
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
