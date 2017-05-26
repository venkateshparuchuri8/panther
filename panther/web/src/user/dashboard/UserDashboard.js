import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../common/components/Page';
import CourseCarousel from './CourseCarousel';
import SurveyModal from './SurveyModal';
import * as actions from './actions/index';
import cookie from 'react-cookie';
class UserDashboard extends Component {

  constructor(props) {
    super(props);
    this.state={

    };
    this.startClass=this.startClass.bind(this);
  }

  componentDidMount() {
    this.props.actions.getUserCourses(cookie.load('user_obj').user_id);
    //this.props.actions.getSurveyStatus(cookie.load('user_obj').user_id);
    //this.props.actions.getUserCourses(cookie.load('user_obj').user_id);

  }

  startClass(class_id){
    const path='/user/class/'+class_id;
    this.context.router.push(path);
  }

  render() {
    return (
    <Page>
      <CourseCarousel courses={this.props.userCourses} goToClassDetailsPage={this.startClass}/>
      <SurveyModal surveyStatus={this.props.userSurveyStatus}/>
    </Page>

    );
  }
}

UserDashboard.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    userCourses:state.memberCourses,
    userSurveyStatus:state.userSurveyStatus
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
)(UserDashboard);
