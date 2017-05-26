import $ from 'jquery';

export function saveUserLoginDataToStore(value){
  return { type: 'POST_USER_LOGIN', value };
}

export function getNotificationList(notificationObj) {
  return function(dispatch) {
    $.ajax({
      type: 'GET',
      contentType: "application/json",
      url: '/api/member/notifications/list/'+ notificationObj.user_id + '/' + notificationObj.org_id,
      dataType: "json",
      success: function(response) {
        console.log(response.result);
        return dispatch({type: 'GET_NOTIFICATION_LIST', value: response.result});
      }
    });
  };
}

export function getOrgDetails(domain) {
  return $.post('/api/org/getorgdetails', {domain});
}


const shadeColor2 =  function(color, percent) {
    // let num = parseInt(color,16),
    // amt = Math.round(2.55 * percent),
		// R = (num >> 16) + amt,
		// B = (num >> 8 & 0x00FF) + amt,
		// G = (num & 0x0000FF) + amt;
		// const v = (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    // return v;
    // color = "#FF4500";
    let usePound = false;
    if (color[0] == "#") {
        color = color.slice(1);
        usePound = true;
    }
    let num = parseInt(color,16);
    let r = (num >> 16) + percent;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + percent;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    let g = (num & 0x0000FF) + percent;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    console.log(color, (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16));
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

export function setThemeColor(primary, secondary = undefined ) {
  document.documentElement.style.setProperty('--color-primary', primary);
  // document.documentElement.style.setProperty('--color-primary-light-50', shadeColor2(primary, 58));
  document.documentElement.style.setProperty('--color-primary-light-20', shadeColor2(primary, 20));
  document.documentElement.style.setProperty('--color-primary-dark-10', shadeColor2(primary, -10));
  // document.documentElement.style.setProperty('--color-primary-light-55', shadeColor2(primary, 55));
  if(secondary){
    document.documentElement.style.setProperty('--color-secondary-57', shadeColor2(secondary, 57));
  }
}

export function updateNotificationStatus(notification_id,user_id) {
  return function(dispatch) {
    $.ajax({
      type: 'GET',
      contentType: "application/json",
      url: '/api/member/notifications/status/update/'+ notification_id + '/' + user_id,
      dataType: "json",
      success: function(response) {
        console.log(response);
        return dispatch({type: 'UPDATE_NOTIFICATION_STATUS', value: notification_id});
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

