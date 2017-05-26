export default function userReducer(state = [], action) {

  switch (action.type) {
    case 'GET_USER_LIST': {
      return action.value || [];
    }
    case 'GET_EXPORT_LIST': {
      return action.value || [];
    }

    default:
      return state;
  }
}
