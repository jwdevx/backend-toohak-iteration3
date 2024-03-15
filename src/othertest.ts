
/* eslint-disable */
// @ts-nocheck
//TODO REMOVE THIS 2 COMMENTS ABOVE when this file is lintsafe and typesafe

/*
Found 2 errors in the same file, starting at: src/other.test.ts:8
*/
//TODO REMOVE THIS COMMENTS ABOVE ----------------------------------------------

import { clear } from './other';
import { getData, setData } from './dataStore';

describe('Testing the clear function', () => {
  test('Test successful clear', () => {
    clear();
    setData({
      users: [{ id: 1, name: 'User 1' }],
      quizzes: [{ id: 1, name: 'Quiz 1' }]
    });
    clear();
    const currentData = getData();
    expect(currentData).toEqual({
      users: [],
      quizzes: [],
    });
  });
});
