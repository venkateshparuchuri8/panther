import 'babel-polyfill';
import React, { PropTypes, Component } from 'react';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import { Container } from 'reactstrap';
import * as actions from '../actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import ChannelReplyBox from '../../forums/ChannelReplyBox';
import cookie from 'react-cookie';
import io from 'socket.io-client';


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isReplyBoxOpen: true,
        notificationObj: {}
    };

    this.toggleReplyBox = this.toggleReplyBox.bind(this);
    this.readedNotification=this.readedNotification.bind(this);

  }


  toggleReplyBox() {
    this.setState({
      isReplyBoxOpen: !this.state.isReplyBoxOpen
    });
  }

  readedNotification(notification){
    console.log(notification);
    this.props.actions.updateNotificationStatus(notification.notification_id,cookie.load('user_obj').user_id);
  }

  componentDidMount() {  
    let cookieObj=cookie.load('user_obj');  
    this.props.actions.updateUserXPPoints(cookieObj.user_id);
    let me = this;
    this.socket = io.connect('/');
    //this.socket = io.connect('http://localhost:3000');
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

    let notificationObj = {
      'user_id': cookie.load('user_obj').user_id,
      'org_id': cookie.load('org_details').org_id
    }

    console.log(this.props.actions);
    this.props.actions.getNotificationList(notificationObj)
  }



  render() {
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <PrimaryNav />
        <SecondaryNav userPoints={this.props.userPoints} readedNotification={this.readedNotification} notificationlist={this.props.notificationsList} notification={this.state.notificationObj} brandName="RWB" brandLogoUrl={brandImage} />
        <div className="main">
          {/*<Container fluid={true} className="main-inner">
            <div className="main-page-header">
              <h1 className="main-page-title">{this.props.pageTitle}</h1>
              {this.props.pageAction}
            </div>
            <p className="main-page-description">
              {this.props.pageDescription}
              {this.props.pageDescriptionAction}
            </p>
          </Container>
          */}
          <Container fluid={true} className="main-inner">
            {this.props.children}
          </Container>
        </div>

    {/*{this.state.isReplyBoxOpen ? <ChannelReplyBox toggle={this.toggleReplyBox}/> : ''}*/}

      </div>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node,
  pageAction: PropTypes.element,
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  pageDescriptionAction: PropTypes.element
};

function mapStateToProps(state) {
  return {
    notificationsList: state.notificationsList,
    userPoints:state.userPoints
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (Page);
