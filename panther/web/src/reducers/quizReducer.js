export default function quizReducer(state = [], action) {

  switch (action.type) {
    case 'GET_QUIZ_LIST': {
      return action.value || [];
    }
    default:
      return state;
  }
}
