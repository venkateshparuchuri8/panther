import React, {Component } from 'react';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import BreadCrumb from './BreadCrumb';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/index';
import cookie from 'react-cookie';
import io from 'socket.io-client';

//const socket = io('http://localhost:3000');

class ChildPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplyBoxOpen: true,
      notificationObj:{}
    };
    this.toggleClassList = this.toggleClassList.bind(this);
    this.readedNotification=this.readedNotification.bind(this);
  }
  toggleClassList(event){
    event.preventDefault();
    this.props.toggleClassList();
  }
  readedNotification(notification){
    console.log(notification);
    this.props.actions.updateNotificationStatus(notification.notification_id,cookie.load('user_obj').user_id);
  }
  componentDidMount() {
    console.log('Page mounted!');
    console.log(cookie.load('org_details').org_id);
    let me = this;
    this.socket = io.connect('/');
    //this.socket = io.connect('http://localhost:3000');
    let cookieObj=cookie.load('user_obj');
    this.props.actions.updateUserXPPoints(cookieObj.user_id);
    this.socket.on(cookie.load('org_details').org_id, function(data) {
            console.log(data);
            if (cookieObj.user_id != data.data.user_id) {
                me.setState({ 'notificationObj': data.data });
                console.log('Came to emitted');
                setTimeout(() => {
                    me.setState({
                        notificationObj: {}
                    });
                }, 8000);
            }
    });
    let notificationObj1 = {
      'user_id': cookie.load('user_obj').user_id,
      'org_id': cookie.load('org_details').org_id
    }

    console.log(this.props.actions);
    this.props.actions.getNotificationList(notificationObj1)
  }

  render() {
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <PrimaryNav />
        <SecondaryNav userPoints={this.props.userPoints} readedNotification={this.readedNotification} notificationlist={this.props.notificationsList} notification={this.state.notificationObj} brandName="RWB" brandLogoUrl={brandImage}/>
        {this.props.childPageType == 'classPage' ?
        <span onClick={this.toggleClassList} className="-hamburger">{this.props.classListStatus ? <img src="/assets/icon-hamburger-close.svg"/> : <img src="/assets/icon-hamburger.svg"/>}</span> : ''}
        <BreadCrumb backLink={this.props.backLink} backText={this.props.backText}/>
          <div className="main main-sidebar">
            {this.props.children}
          </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    notificationsList: state.notificationsList,
    userPoints:state.userPoints
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}
// CoursePage.propTypes = {
//   children: PropTypes.element
// };
export default connect(
  mapStateToProps,
  mapDispatchToProps
) (ChildPage);

