import $ from 'jquery';

export function getUserCourses(user_id) {
  return function (dispatch) {
    $.post("/api/member/course/list/"+user_id+'').done((response) => {
        return dispatch({ type: 'GET_USER_COURSES', value: response.result });
    });
  };
}

export function getSurveyStatus(user_id) {
      return function (dispatch) {

        $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/survey/checksurveystatus?user_id='+user_id+'',
        dataType: "json",
        success: function(response) {
            return dispatch({ type: 'GET_SURVEY_STATUS', value: response.result});
        }
      });

   };
}


export function updateSurveyStat(obj){
  return function(dispatch){
    $.post('/api/survey/completesurvey',obj).done((response) =>{
      updateUserXPPoints(obj.user_id);
       return dispatch({type:'SURVEY_STAT_UPDATE',value:response.result});
    });
  };
}

export function updateUserXPPoints(user_id){
  return function(dispatch){
    $.ajax({
      type:'post',
      url:'/api/userscore/totalpoints/'+ user_id +'',
      success:function(response){
      console.log(response);
        
        return dispatch({type:'UPDATE_USER_POINTS',value : response.result});
      }
    });
  };
}
