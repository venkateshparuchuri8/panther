import $ from 'jquery';
import toastr from 'toastr';

export function materialList(user_id){
  return function(dispatch){
     $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/material/user/completedMaterials/'+ user_id,
        dataType: "json",
        success: function(response) {
          return dispatch({ type: 'MATERIAL_LIST', value: response});
        }
      });
  };
}

export function bookMarkingMaterial(obj){
  return function(dispatch){
    $.ajax({
      type:'PUT',
      contentType:"application/json",
      url:'/api/member/bookmark',
      data: JSON.stringify(obj),
      success:function(response){
        toastr.success("Material Bookmarked Succesfully", "Success");
        return dispatch({type:'MATERIAL_LIST_BOOKMARK_ACTION',value : response.result});
      }
    });
  };
}
