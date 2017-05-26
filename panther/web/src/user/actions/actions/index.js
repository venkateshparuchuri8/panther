import $ from 'jquery';
import toastr from 'toastr';


export function getAllUserActions(user_id){
  return function(dispatch){
     $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/action/getAllUserActions/'+ user_id,
        dataType: "json",
        success: function(response) {
          return dispatch({ type: 'ALL_USER_ACTIONS', value: response.result});
        }
      });
  };
}
export function updateActions(userObj){
  return function(dispatch){
    $.ajax({
      type:'PUT',
      contentType:"application/json",
      url:'/api/action/updateaction',
      data: JSON.stringify(userObj),
      success:function(response){
        toastr.success("Action Updated Succesfully", "Success");
        return dispatch({type:'UPDATE_ACTIONS',value : response.result});
      }
    });
  };
}
