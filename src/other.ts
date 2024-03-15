import { setData, DataStore } from './dataStore';

export function clear(): Record<string, never> {
  setData({
    users: [],
    quizzes: [],
  } as DataStore);
  return {};
}
