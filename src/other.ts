import { setData, DataStore } from './dataStore';

export function clear(): Record<string, never> {
  setData({
    users: [],
    quizzes: [],
    tokens: [],
  } as DataStore);
  return {};
}
