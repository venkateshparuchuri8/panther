export default function RibbonsReducer(state = [], action) {

  switch (action.type) {
    case 'GET_USERS_RIBBON': {
      return action.value || [];
    }
    default:
      return state;
  }
}