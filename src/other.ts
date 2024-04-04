import { setData, DataStore } from './dataStore';

export function clear(): Record<string, never> {
  setData({
    users: [],
    quizzes: [],
    tokens: [],
    sessions: [],
  } as DataStore);
  return {};
}
