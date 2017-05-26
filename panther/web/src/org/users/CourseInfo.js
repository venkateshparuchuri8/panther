import React, { Component } from 'react';
//import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
//import {Row, Col} from 'reactstrap';
//import * as actions from '../common/actions/index';
//import cookie from 'react-cookie';
import Collapsible from 'react-collapsible';
import { uniqBy, filter, groupBy} from 'lodash';

 const ProgressElement = (props) => {
    return(
      <span><img className="mr-2" src="/assets/icon-clock.svg"/>{props.name}</span>
    );
  };



const CompletedElement = (props)=> {
    return(
      <span><img className="mr-2" src="/assets/icon-completed.svg"/>{props.name}</span>
    );
};

const LockedElement = (props) => {

    return(
      <span className="opacity-4"><img className="mr-2" src="/assets/icon-lock.svg"/>{props.name}</span>
    );
};

class CourseInfo extends Component {
    constructor(props) {
    super(props);
    this.state = {
    };
  }

  coursesList(dataArray){
    let courseVariable = dataArray.map((e,i) =>{return (
      <Collapsible key={i} trigger={e.class_status == 'started' ? <ProgressElement name={e.class_name} /> : (e.class_status =='completed' ? <CompletedElement name={e.class_name} />: <LockedElement name={e.class_name} />)}>
            {this.lessonsList(e.lessons)}
      </Collapsible>
    );});
    return courseVariable;
  }
lessonsList(lessonArray){
  //let tasks = _.groupBy(lessonArray, "task_id");
  let uniqLessons = uniqBy(lessonArray, 'lesson_id');
  let lessonVariable =  uniqLessons.map((l,i) => {
    l.tasks = filter(lessonArray, ["lesson_id", l.lesson_id]);
    let statusGroup = groupBy(l.tasks, "task_status");
    if(Object.keys(statusGroup).indexOf('started') != -1){
      l.lesson_status = 'started';
    }else if(Object.keys(statusGroup).indexOf('locked') != -1){
      l.lesson_status = 'locked';
    }else{
      l.lesson_status = 'completed';
    }
    return (
    <ul className="pl-4" key={i}>
      <Collapsible trigger={l.lesson_status == 'started' ? <ProgressElement name={l.lesson_name} /> : (l.lesson_status =='completed' ? <CompletedElement name={l.lesson_name} />: <LockedElement name={l.lesson_name} />)}>
            {this.tasksList(l.tasks)}
      </Collapsible>
    </ul>
  );});
  return lessonVariable;
}
tasksList(taskArray){
let taskVariable = taskArray.map((t, i) => {
  return (
    <ul className="course-info-list-lessons pl-4" key={i}>
      {t.task_status=='completed' ? <li><CompletedElement name={t.task_name}/></li> : null}
      {t.task_status=='started' ? <li><ProgressElement name={t.task_name}/></li> : null}
      {t.task_status =='locked' ? <li><LockedElement name={t.task_name}/></li> : null}
    </ul>
  );
});
return taskVariable;
}
  render() {
    let courseDivs =  this.props.coursesData.map((course) => {
      return (
        <div key={course.course_id}>
        <Collapsible key={course.course_id} trigger={course.course_name}>
          <div className="course-info-list-classes pl-4">
          {this.coursesList(course.classes)}
          </div>
        </Collapsible>
        </div>
      );
    });
    return (
    <div>
        {courseDivs}
    </div>
    );
  }
}


export default CourseInfo;
