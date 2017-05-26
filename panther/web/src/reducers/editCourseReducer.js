export default function editCourseReducer(state = [], action) {

  switch (action.type) {
    case 'EDIT_COURSES': {
      return action.value || [];
    }
    default:
      return state;
  }
}