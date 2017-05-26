export default function surveyDataReducer(state = [], action) {

  switch (action.type) {
    case 'GET_SURVEY_STATUS': {
      return action.value || [];
    }
    default:
      return state;
  }
}