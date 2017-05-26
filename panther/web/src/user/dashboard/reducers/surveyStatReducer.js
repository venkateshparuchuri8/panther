export default function surveyStatReducer(state = [], action) {

  switch (action.type) {
    case 'SURVEY_STAT_UPDATE': {
      return action.value || [];
    }
    default:
      return state;
  }
}