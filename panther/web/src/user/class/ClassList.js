import React, { Component} from 'react';
import {connect} from 'react-redux';
import Isvg from 'react-inlinesvg';


class ClassList extends Component {

  constructor(props) {
    super(props);
    this.state={
      activeItemType: '',
    };
    this.taskListView=this.taskListView.bind(this);
    this.openTask=this.openTask.bind(this);
    this.openAction=this.openAction.bind(this);
  }

  openAction(actionObj){
    this.props.openActionDetails(actionObj);
    this.setState({
      activeItemType: 'action'
    });
  }

  openTask(taskObj){
    this.props.openTaskDetails(taskObj);
    this.setState({
      activeItemType: 'task'
    });
  }
  taskListView(tasks){
    let taskVariable = tasks.map((t, i) => {
      return (
        <ul className="lesson-tasklist" key={i}>
          {t.task_status=='completed' ? <li data-id={t.task_id} className={(t.task_id == this.props.activetaskId && this.state.activeItemType == 'task') ? 'is-active completed' : 'completed'} onClick={this.openTask.bind(this,t)}><Isvg src="/assets/icon-completed.svg"></Isvg> <b>{t.lesson_order}.{t.task_order}</b> {t.task_name}</li> : null}
          {t.task_status=='started' ?
          <li data-id={t.task_id} className={this.props.activetaskId == '' ? 'is-active' : ((this.props.activetaskId == t.task_id && this.state.activeItemType == 'task') ? 'is-active' : '')} onClick={this.openTask.bind(this,t)}>
          <Isvg src="/assets/icon-lockopen-white.svg"></Isvg>
          <b> {t.lesson_order}.{t.task_order}</b> {t.task_name}</li>
          : null}
          {t.task_status =='locked' ? <li data-id={t.task_id} className={(this.props.activetaskId == t.task_id && this.state.activeItemType == 'task') ? 'is-active' : 'is-locked'} onClick={this.openTask.bind(this,t)}><Isvg src="/assets/icon-lock.svg"></Isvg> <b>{t.lesson_order}.{t.task_order}</b> {t.task_name}</li> : null}
        </ul>
      );
    });

    return taskVariable;
  }

  render() {
    //const img = 'https://images.unsplash.com/photo-1489769811155-68b5848205ac?dpr=2&auto=format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=';
    const classObj=this.props.classDetails || {};
    const lessonsArray=this.props.classDetails.lessons || [];
    //const lessons= _.uniqBy(classObj.lessons, 'lesson_id') || [];

    return (

    <div className={this.props.classListStatus ? "classlist-wrapper" : "classlist-wrapper is-hidden"}>
      <div className="classlist-cover" style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' + this.props.classDetails.class_image_url + ')'}}>
        <div className="classlist-cover-name">
          <label>Class</label>
          <h1>{classObj.class_name}</h1>
        </div>
      </div>
      {this.props.classDetails.class_status == 'completed' ?
      <div className="classlist-completed">
        <Isvg src="/assets/icon-check-white.svg"></Isvg>
        <h6>{this.props.classDetails.class_total_points} XP Earned</h6>
      </div>:''}


      {lessonsArray.map((less, i) => (
      <div className= {less.lesson_status == 'started' ? "classlist-lesson is-active" : "classlist-lesson"} key={i}>
        <h1>
        {less.lesson_status == 'started' ? <Isvg src="/assets/icon-clock.svg"></Isvg> : null}
        {less.lesson_status == 'completed' ? <Isvg src="/assets/icon-completed.svg"></Isvg> : null}
        {less.lesson_status == 'locked' ? <Isvg src="/assets/icon-lock.svg"></Isvg> : null} {less.lesson_order}. {less.lesson_name}</h1>


          {this.taskListView(less.tasks)}


          {less.action_id ?
             <ul className="lesson-tasklist">
      {less.action_status=='completed' ? <li data-id={less.action_id} className={(less.action_id == this.props.activetaskId && this.state.activeItemType == 'action' ) ? 'is-active' : ''} onClick={this.openAction.bind(this,less)}><Isvg src="/assets/icon-completed.svg"></Isvg> <b>{less.lesson_order}.{less.tasks.length+1}</b> Action Time</li> : null}
      {less.action_status=='started' ? <li data-id={less.action_id} className={(less.action_id == this.props.activetaskId && this.state.activeItemType == 'action') ? 'is-active' : ''} onClick={this.openAction.bind(this,less)}><Isvg src="/assets/icon-actions-sm.svg"></Isvg> <b>{less.lesson_order}.{less.tasks.length+1}</b> Action Time</li> : null}
      {less.action_status =='locked' ? <li data-id={less.action_id} className={(less.action_id == this.props.activetaskId && this.state.activeItemType == 'action') ? 'is-active' : 'is-locked'} onClick={this.openAction.bind(this,less)}><Isvg src="/assets/icon-actions-sm.svg"></Isvg> <b>{less.lesson_order}.{less.tasks.length+1}</b> Action Time</li> : null}
    </ul>
          : ''}


      </div>

      ))}

    </div>

    );
  }
}


function mapStateToProps() {
  return {

  };
}


export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(ClassList);
