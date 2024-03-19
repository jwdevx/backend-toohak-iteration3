import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

import { getData, setData } from './dataStore';
import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  //   adminUserPasswordUpdate,
  adminAuthLogout,
} from './auth';
import {
  adminQuizCreate,
  adminQuizList,
  adminQuizRemove,
  adminQuizInfo,
//   adminQuizNameUpdate,
//   adminQuizDescriptionUpdate
} from './quiz';
import { clear } from './other';

const app = express(); // Set up web app
app.use(json()); // Use middleware that allows us to access the JSON body of requests
app.use(cors()); // Use middleware that allows for access from other domains
app.use(morgan('dev')); // for logging errors (print to terminal)
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

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
// ==============================  AUTH.TS  ====================================
// =============================================================================

// Register a new admin user
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in response) return res.status(400).json({ error: response.error });
  saveData();
  res.status(200).json({ token: response.token });
});

// Login an admin user
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);
  if ('error' in response) return res.status(400).json({ error: response.error });
  saveData();
  res.status(200).json({ token: response.token });
});

// Get the details of an admin user.
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const response = adminUserDetails(req.query.token as string);
  if ('error' in response) return res.status(401).json({ error: response.error });
  res.status(200).json({ response });
});

// Update the details of an admin user (non-password).
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
  if ('error' in response) { return res.status(response.status).json({ error: response.error }); }
  saveData();
  res.json(response);
});

// Update the password of this admin user.
/*
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);
  if ('error' in response) { return res.status(response.status).json({ error: response.error }); }
  saveData();
  res.json(response);
});
*/

// Logs out an admin user who has an active quiz session.
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);
  if ('error' in response) return res.status(401).json({ error: response.error });
  saveData();
  res.json(response);
});

// =============================================================================
// ==============================   OTHER.TS  ==================================
// =============================================================================

// Reset the state of the application back to the start.
app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  saveData();
  res.json(response);
});

// =============================================================================
// ==============================  QUIZ.TS  ====================================
// =============================================================================

/**
 * Provide a list of all quizzes that are owned by the currently logged in user
 */

// TODO edit and confirm the url is correct
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const { token } = req.query;
  const response = adminQuizList(String(token));
  if ('error' in response) {
    return res.status(response.status).json({ error: response.error });
  }
  saveData();
  res.json(response);
});

/**
 * Given basic details about a new quiz, create one for the logged in user
 */
app.post('/v1/admin/quiz/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(token, name, description);
  if ('error' in response) {
    return res.status(response.status).json({ error: response.error });
  }
  saveData();
  //   res.status(200).json({ quizId: response });
  res.json(response);
});

/**
 * Given a particular quiz, send it to the trash (can be recovered later)
 * When this route is called, the timeLastEdited is updated
 */

// TODO edit and confirm the url is correct
app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const { token } = req.query;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(String(token), quizId);
  if ('error' in response) {
    return res.status(response.status).json({ error: response.error });
  }
  saveData();
  res.json(response);
});

/**
 * Get all of the relevant information about the current quiz including questions
 */

// TODO edit and confirm the url is correct
app.get('/v1/admin/quiz/{quizid}', (req: Request, res: Response) => {
  const { token, quizId } = req.body;
  const response = adminQuizInfo(token, quizId);
  if ('error' in response) {
    return res.status(response.status).json({ error: response.error });
  }
  saveData();
  res.json(response);
});

/**
 * Update the name of the relevant quiz
 */

// TODO edit and confirm the url is correct
app.put('/v1/admin/quiz/{quizid}/name', (req: Request, res: Response) => {
  const response = { message: 'TODO: Update Quiz name' };
  res.status(501).json(response);
});

/**
 *  Update the description of the relevant quiz
 */

// TODO edit and confirm the url is correct
app.put('/v1/admin/quiz/{quizid}/description', (req: Request, res: Response) => {
  const response = { message: 'TODO: Update quiz description ' };
  res.status(501).json(response);
});

// =============================================================================
// ============================== ITERATION 2 ==================================
// =============================================================================

/**
 *  View the quizzes that are currently in the trash for the logged in user
 */
// TODO: View the quizzes in trash
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const response = { message: ' TODO: View the quizzes in trash' };
  res.status(501).json(response);
});

/**
 * Restore a particular quiz from the trash back to an active quiz.
 * Note -- This should update it's timeLastEdited timestamp.
 */
// TODO edit and confirm the url is correct
app.post('/v1/admin/quiz/{quizid}/restore', (req: Request, res: Response) => {
  const response = { message: ' TODO: Restore a quiz from trash' };
  res.status(501).json(response);
});

/**
 * Permanently delete specific quizzes currently sitting in the trash
 */

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const response = { message: ' TODO: Empty the trash ' };
  res.status(501).json(response);
});

/**
 *  Transfer ownership of a quiz to a different user based on their email
 */
// TODO edit and confirm the url is correct
app.post('/v1/admin/quiz/{quizid}/transfer', (req: Request, res: Response) => {
  const response = { message: ' TODO: Transfer the quiz to another owner ' };
  res.status(501).json(response);
});

/**
 * Create a new stub question for a particular quiz.
 * When this route is called, and a question is created,
 * the timeLastEdited is set as the same as the created time,
 * and the colours of all answers of that question are randomly generated.
 */
// TODO: Create quiz question
app.post('/v1/admin/quiz/{quizid}/question', (req: Request, res: Response) => {
  const response = { message: ' TODO: Create quiz question' };
  res.status(501).json(response);
});

/**
 * Update the relevant details of a particular question within a quiz.
 * When this route is called, the last edited time is updated,
 * and the colours of all answers of that question are randomly generated.
 *
 */
// TODO edit and confirm the url is correct
app.put('/v1/admin/quiz/{quizid}/question/{questionid}', (req: Request, res: Response) => {
  const response = { message: ' TODO: Update quiz question' };
  res.status(501).json(response);
});

/**
 * Delete a particular question from a quiz
 */
// TODO edit and confirm the url is correct
app.delete('/v1/admin/quiz/{quizid}/question/{questionid}', (req: Request, res: Response) => {
  const response = { message: ' TODO: Delete a particular question from a quiz ' };
  res.status(501).json(response);
});

/**
 * Move a question from one particular position in the quiz to another
 * When this route is called, the timeLastEdited is updated
 */
// TODO edit and confirm the url is correct
app.put('/v1/admin/quiz/{quizid}/question/{questionid}/move', (req: Request, res: Response) => {
  const response = { message: ' TODO: Move a quiz question ' };
  res.status(501).json(response);
});

/**
 * A particular question gets duplicated to immediately after where the source question is
 * When this route is called, the timeLastEdited is updated
 */
// TODO edit and confirm the url is correct
app.post('/v1/admin/quiz/{quizid}/question/{questionid}/duplicate', (req: Request, res: Response) => {
  const response = { message: ' TODO: Duplicate a quiz question  ' };
  res.status(501).json(response);
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

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
