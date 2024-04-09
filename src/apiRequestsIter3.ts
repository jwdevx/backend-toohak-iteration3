import request, { HttpVerb } from 'sync-request-curl';
import { port, url } from './config.json';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';
const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 10000;
import { QuestionBody, QuestionBodyV2 } from './dataStore';
import { message } from './dataStore';
import {
  UserCreateReturn,
  QuizCreateReturn,
  QuestionCreateReturn,
  /* quizInfoV1Return,
  quizInfoV2Return,
  quizListReturn, */
  // TODO
  EmptyObject,
  ErrorObject,
  SessionStatusReturn,
  QuizCreateReturn,
  QuestionCreateReturn,
  SessionCreateReturn,
} from './returnInterfaces';

// interface Payload {
//   [key: string]: any;
// }

// interface ApiResponse<T> {
//   success?: boolean;
//   data?: T;
//   error?: string;
//   status?: number;
// }

// interface RequestHelperReturnType {
//   statusCode?: number;
//   jsonBody?: Record<string, any>;
//   error?: string;
//   status?: number;
//   // data?: T;
// }
// ========================================================================= //
export interface RequestHelperReturnType {
  bodyObj?: UserCreateReturn |
  SessionCreateReturn |
  SessionStatusReturn |
  QuizCreateReturn |
  QuestionCreateReturn |
  // // TODO
  EmptyObject |
  QuizCreateReturn |
  QuestionCreateReturn |
  ErrorObject;
  error?: string;
}

// Helpers:
const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {},
  headers: IncomingHttpHeaders = {}
): RequestHelperReturnType => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const url = SERVER_URL + path;
  const res = request(method, url, { qs, json, headers, timeout: TIMEOUT_MS });
  let responseBody: RequestHelperReturnType;

  try {
    responseBody = {
      bodyObj: JSON.parse(res.body.toString())
    };
  } catch (err) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\nCheck that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
      );
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  // const url = SERVER_URL + path;
  // const res = request(method, url, { qs, json, headers, timeout: 20000 });
  // const bodyString = res.body.toString();
  // let responseBody: RequestHelperReturnType;

  // try {
  //   responseBody = {
  //     jsonBody: JSON.parse(bodyString)
  //   };
  // } catch (err) {
  //   if (res.statusCode === 200) {
  //     throw HTTPError(500,
  //       `Non-jsonifiable body despite code 200: '${res.body}'.\nCheck that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
  //     );
  //   }
  //   responseBody = {
  //     error: JSON.parse(bodyString)
  //   };
  // }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  // NOTE: the error is rethrown in the test below. This is useful becasuse the
  // test suite will halt (stop) if there's an error, rather than carry on and
  // potentially failing on a different expect statement without useful outputs
  switch (res.statusCode) {
    case 400: // BAD_REQUEST
    case 401: // UNAUTHORIZED
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\nHint: Check that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
};

// ========================================================================= //

/**
 * ORDER MATTERS
 *    const res = request(method, url, { qs, json, headers, timeout: TIMEOUT_MS});
 *    1. Method
 *    2. url
 *    3. {query}, {body}, {headers}
 */

// =============================================================================
// =============================    OTHER        ===============================
// =============================================================================

export function clear() {
  return requestHelper('DELETE', '/v1/clear', {});
}

// =============================================================================
// ==========================      USERS V1      ===============================
// =============================================================================

export const adminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return requestHelper('POST', '/v1/admin/auth/register', { email, password, nameFirst, nameLast });
};
export const adminAuthLogin = (email: string, password: string) => {
  return requestHelper('POST', '/v1/admin/auth/login', { email, password });
};
export const adminAuthLogout = (token: string) => {
  return requestHelper('POST', '/v1/admin/auth/logout', { token });
};
export const adminUserDetails = (token: string) => {
  return requestHelper('GET', '/v1/admin/user/details', { token });
};
export const adminUserDetailsUpdate = (token: string, email: string, nameFirst: string, nameLast: string) => {
  return requestHelper('PUT', '/v1/admin/user/details', { token, email, nameFirst, nameLast });
};
export const adminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT', '/v1/admin/user/password', { token, oldPassword, newPassword });
};

// =============================================================================
// ===========================     USERS V2        =============================
// =============================================================================

export const adminAuthLogoutV2 = (token: string) => {
  return requestHelper('POST', '/v2/admin/auth/logout', {}, { token });
};
export const adminUserDetailsV2 = (token: string) => {
  return requestHelper('GET', '/v2/admin/user/details', {}, { token });
};
export const adminUserDetailsUpdateV2 = (token: string, email: string, nameFirst: string, nameLast: string) => {
  return requestHelper('PUT', '/v2/admin/user/details', { email, nameFirst, nameLast }, { token });
};
export const adminUserPasswordUpdateV2 = (token: string, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT', '/v2/admin/user/password', { oldPassword, newPassword }, { token });
};

// =============================================================================
// ===================   Quiz Management (General v1)    =======================
// =============================================================================

export const adminQuizCreate = (token: string, name: string, description: string) => {
  return requestHelper('POST', '/v1/admin/quiz/', { token, name, description });
};
export const adminQuizList = (token: string) => {
  return requestHelper('GET', '/v1/admin/quiz/list', { token });
};
export const adminQuizTrashView = (token: string) => {
  return requestHelper('GET', '/v1/admin/quiz/trash', { token });
};
export const adminQuizTrashEmpty = (token: string, quizIds: string) => {
  return requestHelper('DELETE', '/v1/admin/quiz/trash/empty', { token, quizIds });
};

// =============================================================================
// ===================   Quiz Management (General v2)    =======================
// =============================================================================

export const adminQuizCreateV2 = (token: string, name: string, description: string) => {
  return requestHelper('POST', '/v2/admin/quiz/', { name, description }, { token });
};
export const adminQuizListV2 = (token: string) => {
  return requestHelper('GET', '/v2/admin/quiz/list', { token });
};
export const adminQuizTrashViewV2 = (token: string) => {
  return requestHelper('GET', '/v2/admin/quiz/trash', { token });
};
export const adminQuizTrashEmptyV2 = (token: string, quizIds: string) => {
  return requestHelper('DELETE', '/v2/admin/quiz/trash/empty', { quizIds }, { token });
};

// =============================================================================
// =====================    Quiz-Specific Routes (v1)     ======================
// =============================================================================

export const adminQuizInfo = (token: string, quizId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}`, { token });
};
export const adminQuizRemove = (token: string, quizId: number) => {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizId}`, { token });
};
export const adminQuizNameUpdate = (quizId:number, token: string, name: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/name`, { token, name });
};
export const adminQuizDescriptionUpdate = (quizId:number, token: string, description: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/description`, { token, description });
};
export const adminQuizTrashRestore = (token: string, quizId: number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/restore`, { token });
};
export const adminQuizTransfer = (quizId: number, token: string, userEmail: string) => {
  return requestHelper('POST', '/v1/admin/quiz/' + quizId + '/transfer', { token, userEmail });
};

// =============================================================================
// ===================   Quiz-Specific Routes (v2)   =======================
// =============================================================================

//! New Function,
export const adminQuizInfoV2 = (token: string, quizId: number) => {
  return requestHelper('GET', `/v2/admin/quiz/${quizId}`, {}, { token });
};
//! New Function,
export const adminQuizRemoveV2 = (token: string, quizId: number) => {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizId}`, {}, { token });
};
export const adminQuizNameUpdateV2 = (quizId:number, token: string, name: string) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/name`, { name }, { token });
};
export const adminQuizDescriptionUpdateV2 = (quizId:number, token: string, description: string) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/description`, { description }, { token });
};
export const adminQuizTrashRestoreV2 = (token: string, quizId: number) => {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/restore`, {}, { token });
};
export const adminQuizTransferV2 = (quizId: number, token: string, userEmail: string) => {
  return requestHelper('POST', '/v2/admin/quiz/' + quizId + '/transfer', { userEmail }, { token });
};

// =============================================================================
// ===================   Question-Specific Routes (v1)   =======================
// =============================================================================

export const adminQuestionCreate = (token: string, quizId: number, questionBody: QuestionBody) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question`, { token, questionBody });
};
export const adminQuestionUpdate = (token: string, quizId: number, questionId:number, questionBody: QuestionBody) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}`, { token, questionBody });
};
export const adminQuestionRemove = (quizId: number, questionId: number, token: string) => {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizId}/question/${questionId}`, { token });
};
export const adminQuestionMove = (quizId: number, questionId: number, token: string, newPosition: number) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}/move`, { token, newPosition });
};
export const adminQuestionDuplicate = (token: string, quizId: number, questionId:number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, { token });
};

// =============================================================================
// ===================    Question-Specific Routes V2    =======================
// =============================================================================

//! New Function, becareful QuestionBodyV2
export const adminQuestionCreateV2 = (token: string, quizId: number, questionBody: QuestionBodyV2) => {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/question`, { questionBody }, { token });
};
//! New Function, becareful QuestionBodyV2
export const adminQuestionUpdateV2 = (token: string, quizId: number, questionId:number, questionBody: QuestionBodyV2) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}`, { questionBody }, { token });
};
export const adminQuestionRemoveV2 = (quizId: number, questionId: number, token: string) => {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizId}/question/${questionId}`, {}, { token });
};
export const adminQuestionMoveV2 = (quizId: number, questionId: number, token: string, newPosition: number) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition }, { token });
};
export const adminQuestionDuplicateV2 = (token: string, quizId: number, questionId:number) => {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token });
};

// =============================================================================
// =================   Starting Quiz and Session Management   ==================
// =============================================================================

export const adminQuizThumbnailUpdate = (token: string, quizId: number, imgUrl: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/thumbnail`, { imgUrl }, { token });
};
export const adminQuizViewSessions = (token: string, quizId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/sessions`, {}, { token });
};
export const adminQuizSessionStart = (token: string, quizId: number, autoStartNum: number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/session/start`, { autoStartNum }, { token });
};
export const adminQuizSessionStateUpdate = (token: string, quizId: number, sessionId: number, action: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/session/${sessionId}`, { action }, { token });
};
export const adminQuizSessionGetStatus = (token: string, quizId: number, sessionId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}`, {}, { token });
};
export const adminQuizSessionGetResults = (token: string, quizId: number, sessionId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}/results`, {}, { token });
};
export const adminQuizSessionGetResultsCSV = (token: string, quizId: number, sessionId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}/results/csv`, {}, { token });
};

// =============================================================================
// ================   Player Interaction and Real-time Features   ==============
// =============================================================================

export const playerJoin = (sessionId: number, name: string) => {
  return requestHelper('POST', '/v1/player/join', { sessionId, name });
};
export const playerStatus = (playerId: number) => {
  return requestHelper('GET', `/v1/player/${playerId}`, {});
};
export const playerQuestionPositionInfo = (playerId: number, questionPosition: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionPosition}`, {});
};
export const playerQuestionAnswerSubmit = (playerId: number, questionPosition: number, answerIds: number[]) => {
  return requestHelper('PUT', `/v1/player/${playerId}/question/${questionPosition}/answer`, { answerIds });
};
export const playerQuestionResults = (playerId: number, questionPosition: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionPosition}/results`, {});
};
export const playerFinalResults = (playerId: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/results`, {});
};
export const playerReturnAllChat = (playerId: number) => {
  return requestHelper('GET', `/v1/player/${playerId}/chat`, {});
};
export const playerSendChat = (playerid: number, message: message) => {
  return requestHelper('POST', `/v1/player/${playerid}/chat`, { message });
};
