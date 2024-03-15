import request from 'sync-request-curl';
import config from './config.json';
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
      nameLast: nameLast,
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};

// TODO adminAuthLogin here ---->>>>

// To Uncomment once venus is finish->
/*
export const adminUserDetails = (sessionId: string) => {
  const res = request('GET', SERVER_URL + '/v1/admin/user/details', {
    qs: {
      token: sessionId,
    },
    timeout: 100
  });
  return {
    bodyObj: JSON.parse(res.body as string),
    statusCode: res.statusCode
  };
};
*/

// =============================================================================
// ===========================     QUIZZES        ==============================
// =============================================================================

// TODO

// =============================================================================
// ==========================     QUESTIONS        =============================
// =============================================================================

// TODO
