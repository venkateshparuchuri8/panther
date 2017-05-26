
import React, { Component,PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../common/components/Page';
import CourseTable from './CourseTable';
import CourseCreateForm from './courseCreateForm';
import { Button, Modal, ModalHeader} from 'reactstrap';
import * as actions from '../common/actions/index';
import cookie from 'react-cookie';
const _ = require('lodash');
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      courseFormState:'create',
      buttonLoading:false
    };

    this.toggle = this.toggle.bind(this);
    this.editCourse=this.editCourse.bind(this);
    this.createOrUpdateCourse=this.createOrUpdateCourse.bind(this);
  }
  componentDidMount() {
    this.props.actions.getCourses(cookie.load('org_obj').org_id);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.courses != undefined){
      if(this.state.modal){
        this.setState({'buttonLoading':false});
        this.toggle();
      }
    }
  }
  createOrUpdateCourse(obj){
    this.setState({'buttonLoading':true});
     if(obj.id){
      this.props.actions.saveEditedCourse(obj);
     }else{
      this.props.actions.courseCreation(obj);
     }

  }

  toggle(data) {
    this.setState({
      modal: !this.state.modal,
    });

    if(data != 'edit'){
    this.setState({
      courseObj: '',
      courseFormState:'creat'
    });
    }
  }
  editCourse(course_id){
     const courseObject=_.find(this.props.courses, { 'id': course_id });
     this.setState({'courseObj':courseObject});
     const data='edit';
     this.setState({'courseFormState':'edit'});
     this.toggle(data);
  }

  render() {
    return (
    <Page pageTitle="Courses"
      pageDescription="Here you can add new or edit existing courses"
      pageAction={<Button size ="sm" color="primary" onClick={this.toggle}> Add New </Button>}>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>{this.state.courseFormState == 'edit' ? 'Edit Course' : 'Add New Course'}</ModalHeader>
        <CourseCreateForm buttonLoading={this.state.buttonLoading} cFormStatus={this.state.courseFormState} creatorupdate={this.createOrUpdateCourse} course_obj={this.state.courseObj} closeAction={this.toggle}/>
      </Modal>
      <CourseTable courses={this.props.courses} edit={this.editCourse}/>
    </Page>

    );
  }
}


function mapStateToProps(state) {
  return {
    courses: state.courses,
    auth:state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  size: PropTypes.string,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['static'])
  ]),
  keyboard: PropTypes.bool,
  zIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  modalClassName: PropTypes.string,
  backdropClassName: PropTypes.string,
  contentClassName: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);


