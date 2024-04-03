import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

import { getData, setData } from './dataStore';
import { clear } from './other';

//! * BEFORE YOU DO V2 TEST.TS MAKE SURE TEST COVERAGE IS 100%
import {
  adminAuthRegister, //! throw error + modify hashing
  adminAuthLogin, // TODO throw error
  adminAuthLogout, // TODO throw error
  adminUserDetails, // TODO throw error
  adminUserDetailsUpdate, // TODO throw error
  adminUserPasswordUpdate, //! throw error + modify hashing
} from './auth';
import {
  adminQuizCreate, // TODO throw error
  adminQuizList, // TODO throw error
  adminQuizTrashView, // TODO throw error
  adminQuizTrashEmpty, // TODO throw error

  adminQuizInfo, // TODO throw error
  adminQuizInfoV2, //! new function !!! has different return type.

  adminQuizRemove, //! throw error and add END state error
  // I am asking forum if this need to be a new function
  adminQuizRemoveV2, //! New function: throw error and addEND state error

  adminQuizNameUpdate, // TODO throw error
  adminQuizDescriptionUpdate, // TODO throw error
  adminQuizTrashRestore, // TODO throw error
  adminQuizTransfer // TODO throw error and add END state error

} from './quiz';
import {
  adminQuestionCreate, // TODO throw error
  adminQuestionUpdate, // TODO throw error

  adminQuestionCreateV2, //! New function - ! has a different input type.
  adminQuestionUpdateV2, //! New function - ! has different body input.

  adminQuestionRemove, // TODO throw error
  adminQuestionMove, //! throw error and add END state error
  adminQuestionDuplicate, // TODO throw error

} from './question';
import {
  adminQuizThumbnailUpdate, adminQuizViewSessions, adminQuizSessionStart,
  adminQuizSessionStateUpdate, adminQuizSessionGetStatus, adminQuizSessionGetResults,
  adminQuizSessionGetResultsCSV,
} from './session';
import {
  playerJoin, playerStatus, playerQuestionPositionInfo, playerQuestionAnswerSubmit,
  playerQuestionResults, playerFinalResults, playerReturnAllChat, playerSendChat
} from './player';

const app = express(); // Set up web app
app.use(json()); // Use middleware that allows us to access the JSON body of requests
app.use(cors()); // Use middleware that allows for access from other domains
app.use(morgan('dev')); // for logging errors (print to terminal)
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

/* ----------------------------   WARNING   ------------------------------------
Please note, when you have a single route (e.g. /my/route/name) alongside
  a wildcard route (e.g. /my/route/{variable})
  you need to define the single route before the variable route.

Clear
  DELETE /v1/clear - JASON

Authentication and User Management (v1)
  POST /v1/admin/auth/register - JASON
  POST /v1/admin/auth/login - VENUS
  POST /v1/admin/auth/logout - JASON
  GET /v1/admin/user/details - VENUS
  PUT /v1/admin/user/details - JASON
  PUT /v1/admin/user/password - VENUS

//* Authentication and User Management (v2)
  POST /v2/admin/auth/logout - New
  GET /v2/admin/user/details - New
  PUT /v2/admin/user/details - New
  PUT /v2/admin/user/password - New

Quiz Management (General v1)
  POST /v1/admin/quiz - SADAT
  GET /v1/admin/quiz/list - CHENG
  GET /v1/admin/quiz/trash - CHENG
  DELETE /v1/admin/quiz/trash/empty - JASON

//* Quiz Management (General v2)
  GET /v2/admin/quiz/list - New
  POST /v2/admin/quiz - New
  GET /v2/admin/quiz/trash - New
  DELETE /v2/admin/quiz/trash/empty - New

Quiz-Specific Routes (v1)
  GET /v1/admin/quiz/{quizid} - SADAT
  DELETE /v1/admin/quiz/{quizid} - CHENG
  PUT /v1/admin/quiz/{quizid}/name - ASH
  PUT /v1/admin/quiz/{quizid}/description - ASH
  POST /v1/admin/quiz/{quizid}/restore - CHENG
  POST /v1/admin/quiz/{quizid}/transfer - VENUS

//* Quiz-Specific Routes (v2)
  GET /v2/admin/quiz/{quizid} - New
  DELETE /v2/admin/quiz/{quizid} - New
  PUT /v2/admin/quiz/{quizid}/name - New
  PUT /v2/admin/quiz/{quizid}/description - New
  POST /v2/admin/quiz/{quizid}/restore - New
  POST /v2/admin/quiz/{quizid}/transfer - New

Question-Specific Routes (v1)
  POST /v1/admin/quiz/{quizid}/question - CHENG
  PUT /v1/admin/quiz/{quizid}/question/{questionid} - ASH
  DELETE /v1/admin/quiz/{quizid}/question/{questionid} - SADAT
  PUT /v1/admin/quiz/{quizid}/question/{questionid}/move - SADAT
  POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - ASH

//* Question-Specific Routes (v2)
  POST /v2/admin/quiz/{quizid}/question - New
  PUT /v2/admin/quiz/{quizid}/question/{questionid} - New
  DELETE /v2/admin/quiz/{quizid}/question/{questionid} - New
  PUT /v2/admin/quiz/{quizid}/question/{questionid}/move - New
  POST /v2/admin/quiz/{quizid}/question/{questionid}/duplicate - New

//* Starting Quiz and Session Management
  PUT /v1/admin/quiz/{quizid}/thumbnail - New
  GET /v1/admin/quiz/{quizid}/sessions - New
  POST /v1/admin/quiz/{quizid}/session/start - New
  PUT /v1/admin/quiz/{quizid}/session/{sessionid} - New
  GET /v1/admin/quiz/{quizid}/session/{sessionid} - New
  GET /v1/admin/quiz/{quizid}/session/{sessionid}/results - New
  GET /v1/admin/quiz/{quizid}/session/{sessionid}/results/csv - New

//* Player Interaction and Real-time Features
  POST /v1/player/join - New
  GET /v1/player/{playerid} - New
  PUT /v1/player/{playerid}/question/{questionposition}/answer - New
  GET /v1/player/{playerid}/question/{questionposition}/results - New
  GET /v1/player/{playerid}/results - New
  GET /v1/player/{playerid}/chat - New
  POST /v1/player/{playerid}/chat - New
*/

// =============================================================================
// ============================ LOAD & SAVE DATA ===============================
// =============================================================================

const load = () => {
  if (fs.existsSync('./database.json')) {
    const file = fs.readFileSync('./database.json', { encoding: 'utf8' });
    setData(JSON.parse(file));
  }
};
load();

function saveData() {
  const data = getData();
  fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
}

// =============================================================================
// ========================== WORK IS DONE BELOW THIS LINE =====================
// =============================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// =============================================================================
// ==============================   OTHER.TS  ==================================
// =============================================================================

// clear: Reset the state of the application back to the start.
app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  saveData();
  res.json(response);
});

// For result in session.ts
app.use(express.static('src'));
app.get('/output.csv', (req, res) => {
  res.header('Content-Type', 'text/csv');
  res.attachment('output.csv');
  res.status(200).send();
});
// =============================================================================
// ==============    Authentication and User Management V1   ===================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminAuthRegister: Register a new admin user
// Function is modified for Iteration 3 will also work for iteration 2
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminAuthLogin: Login an admin user
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);
  saveData();
  res.json(response);
});
//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminAuthLogout: Logs out an dmin user who has an active quiz session.
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);
  saveData();
  res.json(response);
});

// ================================  USER  =====================================
//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminUserDetails: Get the details of an admin user.
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const response = adminUserDetails(req.query.token as string);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminUserDetailsUpdate: Update the details of an admin user (non-password).
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminUserPasswordUpdate: Update the password of this admin user.
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);
  saveData();
  res.json(response);
});
// =============================================================================
// ==============    Authentication and User Management (v2)   =================
// =============================================================================

// Route v2 - Logs out an admin user who has an active quiz session.
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.header('token');
  const response = adminAuthLogout(token);
  saveData();
  res.json(response);
});

// Route v2 - Get the details of this admin user (non-password).
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.header('token');
  const response = adminUserDetails(token);
  saveData();
  res.json(response);
});

// Route v2 -  Update the details of this admin user (non-password).
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.header('token');
  const { email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
  saveData();
  res.json(response);
});

// Route v2 -  Update the password of this admin user.
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.header('token');
  const { oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);
  saveData();
  res.json(response);
});

// =============================================================================
// ===================   Quiz Management (General v1)    =======================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizCreate - Given basic details about a new quiz, create one for the logged in user
app.post('/v1/admin/quiz/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(token, name, description);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizList: Provide a list of all quizzes that are owned by the currently logged in user
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const { token } = req.query;
  const response = adminQuizList(String(token));
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// View the quizzes that are currently in the trash for the logged in user
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const { token } = req.query;
  const response = adminQuizTrashView(String(token));
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizTrashEmpty: Permanently delete specific quizzes currently sitting in the trash
app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizIds = req.query.quizIds as string;
  const response = adminQuizTrashEmpty(token, quizIds);
  saveData();
  res.json(response);
});

// =============================================================================
// ===================   Quiz Management (General v2)    =======================
// =============================================================================

// V2 Create a new quiz
app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.header('token');
  const { name, description } = req.body;
  const response = adminQuizCreate(token, name, description);
  saveData();
  res.json(response);
});

// V2 Lists all user's quizzes
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.header('token');
  const response = adminQuizList(token);
  saveData();
  res.json(response);
});

// V2 Send a quiz to trash
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.header('token');
  const response = adminQuizTrashView(token);
  saveData();
  res.json(response);
});

// V2 Empty the trash
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizIds = req.query.quizIds as string;
  const response = adminQuizTrashEmpty(token, quizIds);
  saveData();
  res.json(response);
});

// =============================================================================
// =====================    Quiz-Specific Routes (v1)     ======================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizInfo: Get all of the relevant information about the current quiz including questions
app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid, 10);
  const token = req.query.token as string;
  const response = adminQuizInfo(token, quizId);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizRemove: Send a quiz to trash (can be recovered later), timeLastEdited is updated
app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const { token } = req.query;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(String(token), quizId);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizNameUpdate: Update the name of the relevant quiz
app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, name } = req.body;
  const response = adminQuizNameUpdate(quizId, token, name);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// adminQuizDescriptionUpdate: Update the description of the relevant quiz
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;
  const response = adminQuizDescriptionUpdate(quizId, token, description);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// Restore a particular quiz from the trash back to an active quiz.
// Note -- This should update it's timeLastEdited timestamp.
app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const { token } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizTrashRestore(String(token), quizId);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// Transfer ownership of a quiz to a different user based on their email
app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, userEmail } = req.body;
  const response = adminQuizTransfer(quizId, token, userEmail);
  saveData();
  res.json(response);
});
// =============================================================================
// =====================    Quiz-Specific Routes (v2)     ======================
// =============================================================================

// Get info about current quiz //! has different return type.
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid, 10);
  const response = adminQuizInfoV2(token, quizId);
  saveData();
  res.json(response);
});

//! only difference is END state error - asking in forum if can be same function
// Send a quiz to trash (can be recovered later),
app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemoveV2(token, quizId);
  saveData();
  res.json(response);
});

// --------------------------- SAME FUNCTION ------------------------------------
// Update quiz name
app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const { name } = req.body;
  const response = adminQuizNameUpdate(quizId, token, name);
  saveData();
  res.json(response);
});

// Update quiz description
app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const { description } = req.body;
  const response = adminQuizDescriptionUpdate(quizId, token, description);
  saveData();
  res.json(response);
});

// Restore a quiz from trash
app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizTrashRestore(token, quizId);
  saveData();
  res.json(response);
});

// Transfer the quiz to another owner
app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const { userEmail } = req.body;
  const response = adminQuizTransfer(quizId, token, userEmail);
  saveData();
  res.json(response);
});

// =============================================================================
// ===================   Question-Specific Routes (v1)   =======================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------

// Create a new stub question for a particular quiz.
app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuestionCreate(token, quizId, questionBody);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// Update the relevant details of a particular question within a quiz.
app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuestionUpdate(token, quizId, questionId, questionBody);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// Delete a particular question from a quiz
app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.query.token as string;
  const response = adminQuestionRemove(quizId, questionId, token);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// Move a quiz question, when this route is called
app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token, newPosition } = req.body;
  const response = adminQuestionMove(quizId, questionId, token, newPosition);
  saveData();
  res.json(response);
});

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
// Duplicate a quiz Question, when this route is called
app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const { token } = req.body;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuestionDuplicate(token, quizId, questionId);
  saveData();
  res.json(response);
});
// =============================================================================
// ===================    Question-Specific Routes V2    =======================
// =============================================================================

//= ============================  new function ==================================
// Create quiz question //!  has a different input type.
app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const { questionBody } = req.body;
  const response = adminQuestionCreateV2(token, quizId, questionBody);
  saveData();
  res.json(response);
});

// Update quiz question //! has different body input.
app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { questionBody } = req.body;
  const response = adminQuestionUpdateV2(token, quizId, questionId, questionBody);
  saveData();
  res.json(response);
});

//= ===========================  same function ==================================
// Delete quiz question
app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuestionRemove(quizId, questionId, token);
  saveData();
  res.json(response);
});

// Move a quiz question
app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { newPosition } = req.body;
  const response = adminQuestionMove(quizId, questionId, token, newPosition);
  saveData();
  res.json(response);
});

// Duplicate a quiz question
app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuestionDuplicate(token, quizId, questionId);
  saveData();
  res.json(response);
});

// =============================================================================
// =================   Starting Quiz and Session Management   ==================
// =============================================================================

// Update the quiz thumbnail
app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const { imgUrl } = req.body;
  const response = adminQuizThumbnailUpdate(token, quizId, imgUrl);
  saveData();
  res.json(response);
});

// View active and inactive quiz sessions
app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizViewSessions(token, quizId);
  saveData();
  res.json(response);
});

// Start a new session for a quiz
app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const { autoStartNum } = req.body;
  const response = adminQuizSessionStart(token, quizId, autoStartNum);
  saveData();
  res.json(response);
});

// Update the state of a particular quiz session by sending an action command
app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const { action } = req.body;
  const response = adminQuizSessionStateUpdate(token, quizId, sessionId, action);
  saveData();
  res.json(response);
});

// Get quiz session status
app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = adminQuizSessionGetStatus(token, quizId, sessionId);
  saveData();
  res.json(response);
});

// Get quiz session final results
app.get('/v1/admin/quiz/:quizid/session/:sessionid/results', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = adminQuizSessionGetResults(token, quizId, sessionId);
  saveData();
  res.json(response);
});

// Get quiz session final results in CSV format
app.get('/v1/admin/quiz/:quizid/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = adminQuizSessionGetResultsCSV(token, quizId, sessionId);
  saveData();
  res.json(response);
});

// =============================================================================
// ================   Player Interaction and Real-time Features   ==============
// =============================================================================

// Allow a guest player to join a session
app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  const response = playerJoin(sessionId, name);
  saveData();
  res.json(response);
});

// Get the status of a guest player that has already joined a session
app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = playerStatus(playerId);
  saveData();
  res.json(response);
});

// Current question information for a player
app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const response = playerQuestionPositionInfo(playerId, questionPosition);
  saveData();
  res.json(response);
});

// Player submission of answers(s)
app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const { answerIds } = req.body;
  const response = playerQuestionAnswerSubmit(playerId, questionPosition, answerIds);
  saveData();
  res.json(response);
});

// Get results for a particular question of the session a player is playing in.
app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const response = playerQuestionResults(playerId, questionPosition);
  saveData();
  res.json(response);
});

// Get the final results for a whole session a player is playing in
app.get('/v1/player/:playerid/results ', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = playerFinalResults(playerId);
  saveData();
  res.json(response);
});

// Return all messages that are in the same session as the player, in the order they were sent
app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = playerReturnAllChat(playerId);
  saveData();
  res.json(response);
});

// Send a new chat message to everyone in the session
app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { message } = req.body;
  const response = playerSendChat(playerId, message);
  saveData();
  res.json(response);
});

// =============================================================================
// ========================= WORK IS DONE BELOW THIS LINE ======================
// =============================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
