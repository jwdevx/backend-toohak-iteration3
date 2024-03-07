import { clear } from "./other.js";
import { getData, setData } from "./dataStore.js";

describe('Testing the clear function', () => {
  test('Test successful clear', () => {
    clear();
    setData({
      users: [{ id: 1, name: "User 1" }],
      quizzes: [{ id: 1, name: "Quiz 1" }]
    });
    clear();
    const currentData = getData();
    expect(currentData).toEqual({
      users: [],
      quizzes: [],
    });
  });
});
