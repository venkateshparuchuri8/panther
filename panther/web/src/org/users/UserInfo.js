import React, { Component } from 'react';
//import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
import Page from '../common/components/Page';
import {Row, Col} from 'reactstrap';
//import * as actions from '../common/actions/index';
//import cookie from 'react-cookie';
import {Tab,Tabs,TabPanel,TabList} from 'react-tabs';
import ProfileInfo from './ProfileInfo';
import CourseInfo from './CourseInfo';
import $ from 'jquery';
import BreadCrumb from './BreadCrumb';


class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId : this.props.params.id,
      initialCoursesText: "Sorry, there is no activity from this user yet.",
      initialActionsText: "Sorry, there is no activity from this user yet."
    };
    this.getUserProfile = this.getUserProfile.bind(this);
    this.ajaxSuccess = this.ajaxSuccess.bind(this);
    this.getUserCourseList = this.getUserCourseList.bind(this);
    this.courseSuccess = this.courseSuccess.bind(this);
  }
  componentWillMount(){
    this.getUserProfile(this.state.userId);
    this.getUserCourseList(this.state.userId);
  }
  getUserProfile(user_id){
    let ajaxSuccess = this.ajaxSuccess;
    $.ajax({
    type: "GET",
    contentType: "application/json",
    url: '/api/user/userinfo'+"?user_id=" + user_id,
    dataType: "json",
    success: ajaxSuccess
    });
  }
  ajaxSuccess(e){
    this.setState({
      userProfileInfo : e.result
    });
  }
  getUserCourseList(user_id){
    let courseSuccess = this.courseSuccess;
    $.ajax({
    type: "GET",
    contentType: "application/json",
    url: '/api/user/usercourseinfo'+"?user_id=" + user_id,
    dataType: "json",
    success: courseSuccess
    });
  }
  courseSuccess(e){
    this.setState({
      userCourseList : e.result
    });
  }
  render() {
    return (
    <Page pageTitle="">
      <BreadCrumb/>
      <Row>
        <Col xs="4">
          <div className="user-info-header">
            <div className="user-avatar-lg mr-3 mb-3" style={{backgroundImage: `url(${this.state.userProfileInfo? this.state.userProfileInfo.profile_pic:''})`}} />
            <div className="user-info-header-name">{this.state.userProfileInfo ? this.state.userProfileInfo.name : ''}
              <p>{this.state.userProfileInfo ? this.state.userProfileInfo.totalPoints : ''} XP</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Tabs>
            <TabList className="mb-3">
              <Tab className="user-tab">Profile</Tab>
              <Tab className="user-tab">Courses</Tab>
              <Tab className="user-tab">Actions</Tab>
            </TabList>

            <TabPanel>
            {this.state.userProfileInfo ?
              <ProfileInfo  profileData={this.state.userProfileInfo}/>
            : <h4 className="text-center mt-10">{this.state.initialCoursesText}</h4>
            }
            </TabPanel>

            <TabPanel>
            {this.state.userCourseList ?
              <CourseInfo coursesData={this.state.userCourseList}/>
              : <h4 className="text-center mt-10">{this.state.initialActionsText}</h4>
            }
            </TabPanel>

            <TabPanel />

          </Tabs>
          </Col>
        </Row>
    </Page>
    );
  }
}


export default UserInfo;
