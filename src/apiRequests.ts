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

export const adminUserDetails = (sessionId: string) => {
  const res = request('GET', SERVER_URL + '/v1/admin/user/details', {
    qs: { token: sessionId }, timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

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

// TODO adminUserPasswordUpdate here ---->>>>
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
// TODO adminAuthLogout here ---->>>>

export const adminAuthLogout = (sessionId: string) => {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/logout', {
    json: { token: sessionId }, timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};
// =============================================================================
// ===========================     QUIZZES        ==============================
// =============================================================================

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

// TODO adminQuizNameUpdate
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

// TODO adminQuizDescriptionUpdate
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

// =============================================================================
// ========================     QUIZZES TRASH        ===========================
// =============================================================================

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
// ==========================     QUESTIONS        =============================
// =============================================================================

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
