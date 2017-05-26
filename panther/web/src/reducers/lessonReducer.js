export default function lessonReducer(state = {}, action) {

  switch (action.type) {
    case 'POST_LESSON_CREATE': {
      return action.value || [];
    }
    case 'POST_LESSONS_LIST' : {
      return action.value || [];
    }
    case 'POST_LESSON_UPDATE': {
      return action.value || [];
    }
    default:
      return state;
  }
}
