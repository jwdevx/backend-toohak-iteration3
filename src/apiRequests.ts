import request from 'sync-request-curl';
import config from './config.json';
import { QuestionBody } from './dataStore';
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

// =============================================================================
// =============================    OTHER        ===============================
// =============================================================================
export const clear = () => {
  const res = request('DELETE', SERVER_URL + '/v1/clear', { timeout: 100 });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

// =============================================================================
// ============================     USERS        ===============================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminAuthRegister = (
  email: string, password: string, nameFirst: string, nameLast: string) => {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/register', {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminAuthLogin = (
  email: string, password: string) => {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/login', {
    json: {
      email: email,
      password: password
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminUserDetailsUpdate = (
  token: string, email: string, nameFirst: string, nameLast: string) => {
  const res = request('PUT', SERVER_URL + '/v1/admin/user/details', {
    json: {
      token: token,
      email: email,
      nameFirst: nameFirst,
      nameLast: nameLast
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminUserPasswordUpdate = (
  token: string, oldPassword: string, newPassword: string) => {
  const res = request('PUT', SERVER_URL + '/v1/admin/user/password', {
    json: {
      token: token,
      oldPassword: oldPassword,
      newPassword: newPassword,
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminUserDetails = (token: string) => {
  const res = request('GET', SERVER_URL + '/v1/admin/user/details', {
    qs: { token: token }, timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminAuthLogout = (token: string) => {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/logout', {
    json: { token: token }, timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

// =============================================================================
// ===========================     USERS V2        =============================
// =============================================================================

export const adminAuthLogoutV2 = (token: string) => {
  const res = request('POST', SERVER_URL + '/v2/admin/auth/logout', {
    headers: { token: token }, timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

export const adminUserDetailsV2 = (token: string) => {
  const res = request('GET', SERVER_URL + '/v2/admin/user/details', {
    headers: { token: token }, timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

export const adminUserDetailsUpdateV2 = (
  token: string, email: string, nameFirst: string, nameLast: string) => {
  const res = request('PUT', SERVER_URL + '/v2/admin/user/details', {
    json: {
      email: email,
      nameFirst: nameFirst,
      nameLast: nameLast
    },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

export const adminUserPasswordUpdateV2 = (
  token: string, oldPassword: string, newPassword: string) => {
  const res = request('PUT', SERVER_URL + '/v2/admin/user/password', {
    json: {
      oldPassword: oldPassword,
      newPassword: newPassword,
    },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

// =============================================================================
// ===================   Quiz Management (General v1)    =======================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizCreate = (
  token: string, name: string, description: string) => {
  const res = request('POST', SERVER_URL + '/v1/admin/quiz/', {
    json: {
      token: token,
      name: name,
      description: description
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizList = (token: string) => {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/list', {
    qs: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizTrashView = (token: string) => {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/trash', {
    qs: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizTrashEmpty = (token: string, quizIds: string) => {
  const res = request('DELETE', SERVER_URL + '/v1/admin/quiz/trash/empty', {
    qs: { token: token, quizIds: quizIds },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// =============================================================================
// ===================   Quiz Management (General v2)    =======================
// =============================================================================

export const adminQuizCreateV2 = (
  token: string, name: string, description: string) => {
  const res = request('POST', SERVER_URL + '/v2/admin/quiz/', {
    json: { name: name, description: description },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuizListV2 = (token: string) => {
  const res = request('GET', SERVER_URL + '/v2/admin/quiz/list', {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuizTrashViewV2 = (token: string) => {
  const res = request('GET', SERVER_URL + '/v2/admin/quiz/trash', {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuizTrashEmptyV2 = (token: string, quizIds: string) => {
  const res = request('DELETE', SERVER_URL + '/v2/admin/quiz/trash/empty', {
    qs: { quizIds: quizIds },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// =============================================================================
// =====================    Quiz-Specific Routes (v1)     ======================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizInfo = (token: string, quizId: number) => {
  const res = request('GET', SERVER_URL + `/v1/admin/quiz/${quizId}`, {
    qs: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizRemove = (token: string, quizId: number) => {
  const res = request('DELETE', SERVER_URL + `/v1/admin/quiz/${quizId}`, {
    qs: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizNameUpdate = (quizId:number, token: string, name: string) => {
  const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/name`, {
    json: {
      token: token,
      name: name
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizDescriptionUpdate = (
  quizId:number, token: string, description: string) => {
  const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/description`, {
    json: {
      token: token,
      description: description
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizTrashRestore = (token: string, quizId: number) => {
  const res = request('POST', SERVER_URL + `/v1/admin/quiz/${quizId}/restore`, {
    json: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuizTransfer = (quizId: number, token: string, userEmail: string) => {
  const res = request('POST', SERVER_URL + '/v1/admin/quiz/' + quizId + '/transfer', {
    json: {
      token: token,
      userEmail: userEmail,
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// =============================================================================
// =====================    Quiz-Specific Routes (v2)     ======================
// =============================================================================

export const adminQuizInfoV2 = (token: string, quizId: number) => {
  const res = request('GET', SERVER_URL + `/v2/admin/quiz/${quizId}`, {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuizRemoveV2 = (token: string, quizId: number) => {
  const res = request('DELETE', SERVER_URL + `/v2/admin/quiz/${quizId}`, {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuizNameUpdateV2 = (quizId:number, token: string, name: string) => {
  const res = request('PUT', SERVER_URL + `/v2/admin/quiz/${quizId}/name`, {
    json: { name: name },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

export const adminQuizDescriptionUpdateV2 = (
  quizId:number, token: string, description: string) => {
  const res = request('PUT', SERVER_URL + `/v2/admin/quiz/${quizId}/description`, {
    json: { description: description },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

export const adminQuizTrashRestoreV2 = (token: string, quizId: number) => {
  const res = request('POST', SERVER_URL + `/v2/admin/quiz/${quizId}/restore`, {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuizTransferV2 = (quizId: number, token: string, userEmail: string) => {
  const res = request('POST', SERVER_URL + '/v2/admin/quiz/' + quizId + '/transfer', {
    json: { userEmail: userEmail },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// =============================================================================
// ===================   Question-Specific Routes (v1)   =======================
// =============================================================================

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuestionCreate = (
  token: string, quizId: number, questionBody: QuestionBody) => {
  const res = request('POST', SERVER_URL + `/v1/admin/quiz/${quizId}/question`, {
    json: {
      token: token,
      questionBody: questionBody
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};
//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuestionUpdate = (
  token: string, quizId: number, questionId:number, questionBody: QuestionBody) => {
  const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
    json: {
      token: token,
      questionBody: questionBody
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};
//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuestionRemove = (
  quizId: number, questionId: number, token: string) => {
  const res = request('DELETE', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`, {
    qs: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};
//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuestionMove = (
  quizId: number, questionId: number, token: string, newPosition: number) => {
  const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
    json: {
      token: token,
      newPosition: newPosition
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

//! ---------------------   WARNING DO NOT MODIFY  -----------------------------
export const adminQuestionDuplicate = (
  token: string, quizId: number, questionId:number) => {
  const res = request('POST', SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, {
    json: {
      token: token,
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// =============================================================================
// ===================    Question-Specific Routes V2    =======================
// =============================================================================

export const adminQuestionCreateV2 = (
  token: string, quizId: number, questionBody: QuestionBody) => {
  const res = request('POST', SERVER_URL + `/v2/admin/quiz/${quizId}/question`, {
    json: { questionBody: questionBody },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuestionUpdateV2 = (
  token: string, quizId: number, questionId:number, questionBody: QuestionBody) => {
  const res = request('PUT', SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}`, {
    json: { questionBody: questionBody },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuestionRemoveV2 = (
  quizId: number, questionId: number, token: string) => {
  const res = request('DELETE', SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}`, {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuestionMoveV2 = (
  quizId: number, questionId: number, token: string, newPosition: number) => {
  const res = request('PUT', SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}/move`, {
    json: { newPosition: newPosition },
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

export const adminQuestionDuplicateV2 = (
  token: string, quizId: number, questionId:number) => {
  const res = request('POST', SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {
    headers: { token: token },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// =============================================================================
// =================   Starting Quiz and Session Management   ==================
// =============================================================================

// TODO adminQuizThumbnailUpdate

// TODO adminQuizViewSessions

export const adminQuizSessionStart = (
  token: string, quizId: number, autoStartNum: number) => {
  const res = request('POST', SERVER_URL + `/v1/admin/quiz/${quizId}/session/start`, {
    headers: { token: token },
    json: { autoStartNum: autoStartNum },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  };
};

// TODO adminQuizSessionStateUpdate

// TODO adminQuizSessionGetStatus

// TODO adminQuizSessionGetResults

// TODO adminQuizSessionGetResultsCSV

// =============================================================================
// ================   Player Interaction and Real-time Features   ==============
// =============================================================================

// TODO playerJoin

// TODO playerStatus

// TODO playerQuestionPositionInfo

// TODO playerQuestionAnswerSubmit

// TODO playerQuestionResults

// TODO playerFinalResults

// TODO playerReturnAllChat

// TODO playerSendChat
