export default function userActionReducer(state = [], action) {

  switch (action.type) {
    case 'ALL_USER_ACTIONS': {
     return action.value || [];
    }
    case 'UPDATE_ACTIONS' : {
      return action.value || [];
    }
    default:
      return state;
  }
}
