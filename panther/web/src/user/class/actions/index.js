import $ from 'jquery';
import toastr from 'toastr';

export function getClassPageDetails(class_id,user_id) {
  return function (dispatch) {
    $.post("/api/member/class/details/"+class_id+"/"+user_id+"").done((response) => {
        return dispatch({ type: 'GET_CLASS_PAGE_DETAILS', value: response.result });
    });
  };
}

export function updateStoreWithTaskStatus(value){
	return function (dispatch) {
  return  dispatch({type:'TASK_STATUS_UPDATE', value});
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
      console.log(response);
        toastr.success("Action Updated Succesfully", "Success");
        updateUserXPPoints(userObj.user_id);
        return dispatch({type:'UPDATE_ACTIONS',value : userObj});
      }
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

export function reflection(obj){
  return $.post('/api/tasks/reflection/response', obj);
  /*return function(dispatch){
    $.post('/api/member/reflection/response',obj).done((response) => {
      toastr.success("Reflection Submitted Succesfully","Success");
      return dispatch({type:'REFLECTION_SUBMIT' , value:response.result});
    });
  };*/
}

export function bookMarkingMaterial(obj){
  return function(dispatch){
    $.ajax({
      type:'PUT',
      contentType:"application/json",
      url:'/api/member/bookmark',
      data: JSON.stringify(obj),
      success:function(response){
      console.log(response);
        toastr.success("Material Bookmarked Succesfully", "Success");
        return dispatch({type:'UPDATE_BOOKMARK_ACTION',value : obj});
      }
    });
  };
}

