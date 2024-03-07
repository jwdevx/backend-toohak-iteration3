import { setData } from "./dataStore";
function clear()
{
    setData({
        users: [],
        quizzes: [],
    })
    return {};
}

export { clear }
