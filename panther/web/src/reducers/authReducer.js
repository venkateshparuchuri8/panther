export default function authReducer(state = {}, action) {

  switch (action.type) {
    case 'POST_ORG_LOGIN': {
      return action.value;
    }
    default:
      return state;
  }
}
