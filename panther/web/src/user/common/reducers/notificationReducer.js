export default function notificationReducer(state = {}, action) {

  switch (action.type) {
    case 'GET_NOTIFICATION_LIST': {
      console.log(action.value);
      return action.value;
    }
    case 'UPDATE_NOTIFICATION_STATUS':{
      let notify = {...state};
      let notifyO={};
      let notifyA=[];
      notify.notifications.map((noti) => {
        if(noti.notification_id ==action.value){
          noti.notification_status='1';
        }
        notifyA.push(noti);
      });
      notifyO.unreaded_notifications_count=notify.unreaded_notifications_count-1;
      notify=notifyO;
      notify.notifications=notifyA;
      return notify || {};
    }
    default:
      return state;
  }
}
