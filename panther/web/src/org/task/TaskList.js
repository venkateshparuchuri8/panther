import React, {Component }  from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../common/actions/index';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.editAction=this.editAction.bind(this);
    this.editTask=this.editTask.bind(this);
  }

  editAction(event){
    event.preventDefault();
    this.props.editActionElement(event.target.id);
  }

  editTask(event){
    event.preventDefault();
    this.props.editTaskElement(event.target.id);
  }
  render() {
    const actionsList=this.props.actionsList || [];
    const tasksList=this.props.tasksList || [];
    return (
      <div>
    <ul className="course-list">
    <label>Tasks ({tasksList.length})</label>
     {tasksList.map((act,i) =>
     <li key={i}>
      <a>{act.title}</a>
      <a id={act.id} className="course-list-icon" onClick={this.editTask}><img alt="edit" id={act.id} title="edit" src={window.location.origin+"/assets/icon-edit.svg"}/></a>
    </li>
    )}
    </ul>
    <ul className="course-list">
    <label>Actions ({actionsList.length})</label>
    {actionsList.map((act,i) =>
     <li key={i}>
      <a>{act.description}</a>
      <a id={act.id} className="course-list-icon" onClick={this.editAction}><img alt="edit" id={act.id} title="edit" src={window.location.origin+"/assets/icon-edit.svg"}/></a>
    </li>
    )}
    </ul>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    viewcourses: state.courseView,
    classes:state.classes
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
)(TaskList);
