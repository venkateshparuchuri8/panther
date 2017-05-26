export default function userBioReducer(state = [], action) {

  switch (action.type) {
    case 'GET_USERS_BIO': {
      return action.value || [];
    }
    default:
      return state;
  }
}