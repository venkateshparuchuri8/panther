export default function uploadReducer(state = [], action) {

  switch (action.type) {
    case 'POST_FILE_UPLOAD': {
      return action.value || [];
    }
    default:
      return state;
  }
}
