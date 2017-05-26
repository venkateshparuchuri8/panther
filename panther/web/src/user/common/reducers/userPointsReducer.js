export default function userPointsReducer(state = {}, action) {

  switch (action.type) {
    case 'UPDATE_USER_POINTS': {
      return action.value;
    }
    default:
      return state;
  }
}