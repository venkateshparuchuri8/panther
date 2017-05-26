export default function viewcourseReducer(state = {}, action) {

  switch (action.type) {
    case 'VIEW_COURSES': {
      return action.value || {};
    }
    default:
      return state;
  }
}
