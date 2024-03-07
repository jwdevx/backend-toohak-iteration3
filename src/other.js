import { setData } from "./dataStore";
function clear()
{
  setData({
    users: [],
      quizzes: [],
  })
}

export { clear }
