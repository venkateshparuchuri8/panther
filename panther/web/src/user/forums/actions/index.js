import $ from 'jquery';

export function getUsersBio(organization_id) {
      return function (dispatch) {

        $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/user/getPoints?organization_id='+organization_id+'',
        dataType: "json",
        success: function(response) {
            return dispatch({ type: 'GET_USERS_BIO', value: response.result});
        }
      });

   };
}
