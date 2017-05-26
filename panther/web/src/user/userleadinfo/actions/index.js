import $ from 'jquery';

export function getUsersLeadInfo(organization_id) {
  return function (dispatch) {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/user/getPoints?organization_id='+organization_id+'',
        dataType: "json",
        success: function(response) {
            return dispatch({ type: 'GET_USERS_LEADINFO', value: response.result});
        }
      });

   };
}

export function getUsersRibbons(user_id) {
  return function (dispatch) {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/user/ribbons/list/'+user_id+'',
        dataType: "json",
        success: function(response) {
            return dispatch({ type: 'GET_USERS_RIBBON', value: response.result});
        }
      });

   };
}
