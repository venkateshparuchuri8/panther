export default function userInfoLeadReducer(state = [], action) {

  switch (action.type) {
    case 'GET_USERS_LEADINFO': {
      return action.value || [];
    }
    default:
      return state;
  }
}