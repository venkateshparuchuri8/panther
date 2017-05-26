import React, {  Component } from 'react';
import Isvg from 'react-inlinesvg';
import ReactHtmlParser from 'react-html-parser';


class NotificationsPanel extends Component {

  constructor(props) {
    super(props);
    this.readNotification=this.readNotification.bind(this);
  }
  
  readNotification(notification){
   this.props.readedNotification(notification);
  }

  render() {
    return (
      <div>
          <div className="notifications-panel animated bounceInRight">
            <div className="notifications-panel-header">
              <h1>You have <b>{this.props.notificationlist.unreaded_notifications_count} new notifications</b></h1>
              <div onClick={this.props.close} className="close"><Isvg src="/assets/icon-close.svg"></Isvg></div>
            </div>
            <ul className="notifications-panel-list">
              {
                this.props.notificationlist.notifications.map((notification, i) => (
                  <li className={notification.notification_status == '0' ? "is-new" : ""} key={i} onClick={this.readNotification.bind(this,notification)}>
                  <p>{ReactHtmlParser(notification.description)}</p>
                  <span className="timestamp">10:01 PM</span>
                  </li>
                ))
              }
            </ul>
        </div>
      </div>
    );
  }
}


export default NotificationsPanel;
