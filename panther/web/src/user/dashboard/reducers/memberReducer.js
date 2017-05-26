export default function memberReducer(state = [], action) {

  switch (action.type) {
    case 'GET_USER_COURSES': {
      return action.value || [];
    }
    default:
      return state;
  }
}