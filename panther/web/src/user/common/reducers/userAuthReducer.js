export default function userAuthReducer(state = {}, action) {

  switch (action.type) {
    case 'POST_USER_LOGIN': {
      return action.value;
    }
    default:
      return state;
  }
}
