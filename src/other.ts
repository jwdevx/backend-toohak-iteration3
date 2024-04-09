import { setData, DataStore } from './dataStore';
import { EmptyObject } from './returnInterfaces';

export function clear(): EmptyObject {
  setData({
    users: [],
    quizzes: [],
    tokens: [],
    sessions: [],
  } as DataStore);
  return {};
}
