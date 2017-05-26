import React, {  Component } from 'react';
//import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Isvg from 'react-inlinesvg';


class NotificationBadge extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notificationStatus: ''
    };

    this.closeNotification = this.closeNotification.bind(this);
    
  }

  closeNotification(notificaiton_id) {
    this.setState({
      notificationStatus: notificaiton_id
    });
  }

  // renderClassNotification() {
  //   if(this.props.notification.type == 'classNotifications') {
  //     return (
  //       <div className="notification-badge-inner">
  //         <p><span className="name">{this.props.notification.user_name}</span> {this.props.notification.class_status} the class <b>{this.props.notification.class_name}</b></p>
  //         <div className="d-flex">
  //           <span className="timestamp mr-3">10:01 PM</span>
  //         </div>
  //       </div>
  //     );
  //   }
  // }


  // renderActionNotification() {
  //   if(this.props.notification.type == 'actionNotifications') {
  //     return (
  //       <div className="notification-badge-inner">
  //         <p><span className="name">{this.props.notification.user_name}</span> {this.props.notification.action_status} the action <b>{this.props.notification.action_name}</b></p>
  //         <div className="d-flex">
  //           <span className="timestamp mr-3">10:01 PM</span>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  render() {
     return (
      <div>
        <div className={this.state.notificationStatus == this.props.notification.notification_id ? "notifications-badge animated fadeIn hide" : "notifications-badge animated fadeIn"}>
          {this.props.notification.type == 'classNotifications' ? <div className="notification-badge-inner">
          <p><span className="name">{this.props.notification.user_name}</span> {this.props.notification.class_status} the class <b>{this.props.notification.class_name}</b></p>
          <div className="d-flex">
            <span className="timestamp mr-3">10:01 PM</span>
          </div>
        </div> : null}
        {this.props.notification.type == 'actionNotifications' ? <div className="notification-badge-inner">
          <p><span className="name">{this.props.notification.user_name}</span> {this.props.notification.action_status} the action <b>{this.props.notification.action_name}</b></p>
          <div className="d-flex">
            <span className="timestamp mr-3">10:01 PM</span>
          </div>
        </div> : null}
          {/*this.renderClassNotification()*/}
          
          {/*this.renderActionNotification()*/}
          <div onClick={this.closeNotification.bind(this, this.props.notification.notification_id)} className="close"><Isvg src="/assets/icon-close.svg"></Isvg></div>
        </div>
      </div>
    );
  }
}

export default NotificationBadge;
