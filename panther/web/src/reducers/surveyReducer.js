export default function surveyReducer(state = [], action) {

  switch (action.type) {
    case 'GET_SURVEY': {
      return action.value || [];
    }
    case 'POST_SURVEY_CREATE': {
      return [...state, action.value] || [];
    }
    case 'POST_SURVEY_DELETE': {
      let result = [];
      state.map((survey)=>{
          if(survey.survey_id == action.value.survey_id){
            //console.log('deleted');
          }else{
            result.push(survey);
          }
      });
      return result || [];
    }
    case 'PUT_SURVEY_STATUSUPDATE': {
      let result = [];
      state.map((survey)=>{
          if(survey.survey_id == action.value.survey_id){
              result.push(action.value);
          }else{
            result.push(survey);
          }
      });
      return result || [];
    }

     case 'PUT_SURVEY_UPDATE': {
      let result = [];
      state.map((survey)=>{
          if(survey.survey_id == action.value.survey_id){
              result.push(action.value);
          }else{
            result.push(survey);
          }
      });
      return result || [];
    }

    // case 'GET_SURVEY_DETAILS': {
    //   return action.value || [];
    // }




    default:
      return state;
  }
}
