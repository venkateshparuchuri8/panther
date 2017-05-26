import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Modal} from 'reactstrap';
//import Page from '../common/components/Page';
import ClassList from './ClassList';
import ClassRoom from './ClassRoom';
//import BreadCrumb from './BreadCrumb';
import ChildPage from '../common/components/ChildPage';
import * as actions from './actions/index';
import cookie from 'react-cookie';
import ViewTaskModal from '../common/components/ViewTaskModal';
import $ from 'jquery';
import Isvg from 'react-inlinesvg';

let _ = require('lodash');


class Class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isClassVisible: false,
      modal:false,
      completedTaskId:'',
      nextTaskId:'',
      activeLessonObj:{},
      activeTaskObj:{},
      lessonStatus:'',
      completedActionId:'',
      classCompleted:false,
      activetaskId:'',
      currentClassStatus:''
    };
    this.saveBug = this.saveBug.bind(this);
    this.toggleClassList = this.toggleClassList.bind(this);
    this.readMaterial=this.readMaterial.bind(this);
    this.toggle=this.toggle.bind(this);
    this.taskComplete=this.taskComplete.bind(this);
    this.taskDetailsPage=this.taskDetailsPage.bind(this);
    this.actionDetailsPage=this.actionDetailsPage.bind(this);
    this.updateActionsStatus=this.updateActionsStatus.bind(this);
    this.bookmarking=this.bookmarking.bind(this);
    this.previousTask=this.previousTask.bind(this);
    this.nextTask=this.nextTask.bind(this);
  }

  componentDidMount() {

     //this.props.actions.getClassPageDetails(this.props.params.id,1)

     this.props.actions.getClassPageDetails(this.props.params.id,cookie.load('user_obj').user_id);

  }

  nextTask(obj,tasktype){
    if(obj.action_id && tasktype=="action"){
      this.setState({'completedTaskId':''});
      const activeLessonObj=_.find(this.props.classPageDetails.lessons,{'lesson_order':obj.lesson_order+1});
      if(activeLessonObj && activeLessonObj.tasks){
      const activeTaskObj=_.find(activeLessonObj.tasks, { 'task_order': 1});
      this.setState({'activetaskId':activeTaskObj.task_id});
      this.setState({'activeLessonObj':activeLessonObj,'activeTaskObj':activeTaskObj,'activeActionObj':''});
      }
    } else {
      this.setState({'completedTaskId':''});
      const activeLessonObj=_.find(this.props.classPageDetails.lessons,{'lesson_order':obj.lesson_order});
      const activeTaskObj=_.find(activeLessonObj.tasks, { 'task_order': obj.task_order+1});
      if(activeTaskObj && activeTaskObj.task_id){
        this.setState({'activetaskId':activeTaskObj.task_id});
        this.setState({'activeLessonObj':activeLessonObj,'activeTaskObj':activeTaskObj,'activeActionObj':''});
      } else {
        const activeActionObj = {
            'action_id': activeLessonObj.action_id,
            'action_status': activeLessonObj.action_status,
            'action_description': activeLessonObj.action_description,
            'lesson_id': activeLessonObj.lesson_id,
            'lesson_order':activeLessonObj.lesson_order
        };
        this.setState({'activetaskId':activeLessonObj.action_id});
        this.setState({ 'activeLessonObj': activeLessonObj, 'activeActionObj': activeActionObj });
      }
    }
  }

  previousTask(obj, tasktype) {
    this.setState({ 'completedTaskId': '' });
    if (obj.action_id && tasktype == "action") {
        const activeLessonObj = _.find(this.props.classPageDetails.lessons, { 'lesson_order': obj.lesson_order });
        if (activeLessonObj && activeLessonObj.tasks) {
            const activeTaskObj = _.find(activeLessonObj.tasks, { 'task_order': activeLessonObj.tasks.length });
            this.setState({ 'activetaskId': activeTaskObj.task_id });
            this.setState({ 'activeLessonObj': activeLessonObj, 'activeTaskObj': activeTaskObj, 'activeActionObj': '' });
        }
    } else {
        if ((obj.task_order - 1) != 0) {
            const activeLessonObj = _.find(this.props.classPageDetails.lessons, { 'lesson_order': obj.lesson_order });
            const activeTaskObj = _.find(activeLessonObj.tasks, { 'task_order': obj.task_order - 1 });
            this.setState({ 'activetaskId': activeTaskObj.task_id });
            this.setState({ 'activeLessonObj': activeLessonObj, 'activeTaskObj': activeTaskObj, 'activeActionObj': '' });
        } else if ((obj.lesson_order - 1) != 0) {
            const activeLessonObj = _.find(this.props.classPageDetails.lessons, { 'lesson_order': obj.lesson_order - 1 });
            if (activeLessonObj && activeLessonObj.action_id) {
                const activeActionObj = {
                    'action_id': activeLessonObj.action_id,
                    'action_status': activeLessonObj.action_status,
                    'action_description': activeLessonObj.action_description,
                    'lesson_id': activeLessonObj.lesson_id,
                    'lesson_order': activeLessonObj.lesson_order
                };
                this.setState({ 'activetaskId': activeLessonObj.action_id });
                this.setState({ 'activeLessonObj': activeLessonObj, 'activeActionObj': activeActionObj });
            } else {
                const activeTaskObj = _.find(activeLessonObj.tasks, { 'task_order': activeLessonObj.tasks.length });
                this.setState({ 'activetaskId': activeTaskObj.task_id });
                this.setState({ 'activeLessonObj': activeLessonObj, 'activeTaskObj': activeTaskObj, 'activeActionObj': '' });
            }
        }
    }
  }

  bookmarking(materialObj){
    console.log(materialObj);
    let bookmarkObj={};
    bookmarkObj.user_id=cookie.load('user_obj').user_id;
    if(materialObj.bookmarked == 1){
      bookmarkObj.bookmarked=0;
    }else{
      bookmarkObj.bookmarked=1;
    }
    bookmarkObj.task_id=materialObj.task_id;
    bookmarkObj.lesson_id=materialObj.lesson_id;
    this.props.actions.bookMarkingMaterial(bookmarkObj);
  }

  saveBug(data,id){
    console.log("am in class");
    console.log(data +"____"+id);
    let obj= {};
    obj.task_id = id ;
    obj.user_id = cookie.load('user_obj').user_id ;
    obj.description = data;
    $.post('/api/bug/createbug', obj).done((response) => {
        console.log(response);
    });

  }

  updateActionsStatus(actionObj){
    this.setState({'completedActionId':actionObj.action_id});
    actionObj.class_id=this.props.params.id;
    let remainingActions=[];
    remainingActions=_.filter(this.props.classPageDetails.lessons, _.matches({ 'action_status':'locked' }));
    if(remainingActions.length == 0){
       remainingActions=_.filter(this.props.classPageDetails.lessons, _.matches({ 'action_status':'started' }));
       if(remainingActions.length == 1){
         remainingActions=_.filter(this.props.classPageDetails.lessons, _.matches({ 'lesson_status':'locked' }));
         if(remainingActions.length == 0){
          remainingActions=_.filter(this.props.classPageDetails.lessons, _.matches({ 'lesson_status':'started' }));
          if(remainingActions.length == 1){
            actionObj.classSatus="completed";
          }
        }
      }
    }
    this.props.actions.updateActions(actionObj);
    this.setState({ 'lessonStatus': 'completed' });
    let me=this;
    setTimeout(() => {
      me.setState({
          completedLessonScreenId: 'completed'
      });
    }, 6000);
    if(actionObj.classSatus == 'completed'){
      this.setState({'currentClassStatus':'completed'});
    }
  }


  toggle(){
    this.setState({
      modal:!this.state.modal
    });
   }

   actionDetailsPage(actionObj){
    this.setState({'completedActionId':'','currentClassStatus':'','lessonStatus':'','completedLessonScreenId':''});
    const activeLessonObj=_.find(this.props.classPageDetails.lessons,{'lesson_id':actionObj.lesson_id});
      const activeActionObj={
            'action_id':actionObj.action_id,
            'action_status':actionObj.action_status,
            'action_description':actionObj.action_description,
            'lesson_id':actionObj.lesson_id,
            'lesson_order':actionObj.lesson_order
    };
    this.setState({'activetaskId':actionObj.action_id});
    this.setState({'activeLessonObj':activeLessonObj,'activeActionObj':activeActionObj});
   }

   taskDetailsPage(taskObj){
    this.setState({'completedTaskId':'','currentClassStatus':'','lessonStatus':'','completedLessonScreenId':''});
    const activeLessonObj=_.find(this.props.classPageDetails.lessons,{'lesson_id':taskObj.lesson_id});
       const activeTaskObj=_.find(activeLessonObj.tasks, { 'task_id': taskObj.task_id });
           this.setState({'activetaskId':activeTaskObj.task_id});
       this.setState({'activeLessonObj':activeLessonObj,'activeTaskObj':activeTaskObj,'activeActionObj':''});
   }

   taskComplete(materialObj) {
    let lessonObject = _.find(this.props.classPageDetails.lessons, { 'lesson_order': materialObj.lesson_order });
    let nextTaskObj = _.find(lessonObject.tasks, { 'task_order': materialObj.task_order + 1 });
    let nextTaskId = null;
    let action_id = null;
    let nextLessonId = null;
    let lessonCompleteId=null;
    let currentClassSt=null;
    if (nextTaskObj && nextTaskObj.task_id) {
        nextTaskId = nextTaskObj.task_id;
    } else {
        if (lessonObject.action_id) {
            action_id = lessonObject.action_id;
        }else{
          lessonCompleteId=lessonObject.lesson_id;
        }
        lessonObject = _.find(this.props.classPageDetails.lessons, { 'lesson_order': materialObj.lesson_order + 1 });
        if (lessonObject && lessonObject.lesson_id) {
            nextTaskObj = _.find(lessonObject.tasks, { 'task_order': 1 });
            nextTaskId = nextTaskObj.task_id;
            nextLessonId = nextTaskObj.lesson_id;
        }else if(lessonCompleteId){
            let remainingActions=[];
            remainingActions=_.filter(this.props.classPageDetails.lessons, _.matches({ 'action_status':'started' }));
            if(remainingActions.length == 0){
              currentClassSt='completed';
              this.setState({'currentClassStatus':'completed'});
            } 
        }
    }

    let taskObj = {
        'task_id': materialObj.task_id,
        //'user_id': 1,
        'user_id': cookie.load('user_obj').user_id,
        'status': 'completed'
    };
    if(materialObj.task_order  == 1 && materialObj.lesson_order == 1){
      taskObj.lesson_id=materialObj.lesson_id;
      taskObj.class_id=this.props.params.id;
    }
    if (nextTaskId) {
        taskObj.nextTaskId = nextTaskId;
        if (nextLessonId) {
            taskObj.nextLessonId = nextLessonId;
        }
    }
    if (action_id) {
        taskObj.action_id = action_id;
    }
    if(lessonCompleteId){
      taskObj.lessonCompleteId=lessonCompleteId;
      taskObj.class_id=this.props.params.id;

    }
    taskObj.bookmarked=materialObj.bookmarked;
    if(currentClassSt == 'completed'){
      taskObj.currentClassStatus='completed';
    }
    let me=this;
    $.post('/api/member/task/complete', taskObj).done((response) => {
        console.log(response);
        this.setState({ 'completedTaskId': taskObj.task_id, 'nextTaskId': taskObj.nextTask_id });
        setTimeout(() => {
                    me.setState({
                        completedPointsScreenId: taskObj.task_id
                    });
        }, 6000);
        if(taskObj.lessonCompleteId){
          this.setState({ 'lessonStatus': 'completed' });
          let me=this;
          setTimeout(() => {
                    me.setState({
                        completedLessonScreenId: 'completed'
                    });
          }, 6000);
        }
        taskObj.lesson_id = materialObj.lesson_id;

        this.toggle();
        this.props.actions.updateStoreWithTaskStatus(taskObj);
        this.props.actions.updateUserXPPoints(taskObj.user_id);
    });  
}


  readMaterial(task_obj) {
    let materialObj = {
      'material_type': task_obj.material_type,
      'url': task_obj.material_url,
      'material_title': task_obj.material_title,
      'material_id': task_obj.material_id,
      'task_id': task_obj.task_id,
      'task_points': task_obj.task_points,
      'lesson_id': task_obj.lesson_id,
      'task_order': task_obj.task_order,
      'lesson_order': task_obj.lesson_order,
      'task_name': task_obj.task_name,
      'task_status': task_obj.task_status,
      'bookmarked':task_obj.bookmarked,
      'can_embed': task_obj.material_can_embed
    };
    if(task_obj.material_type == 'Reflection'){
      materialObj.reflection_question = task_obj.reflection_question;
      materialObj.reflection_id = task_obj.reflection_id;
      materialObj.materialFlag = false;
    } else if(task_obj.material_type == 'Quiz'){
      materialObj.materialFlag = false;
    } else{
      materialObj.materialFlag=true;
    }
    if(task_obj.material_type == 'Article' || task_obj.material_type == 'Link' || task_obj.material_can_embed == 0){
      debugger;
      let materialObject={
        "material_url" : task_obj.material_url//'https://m.signalvnoise.com/correcting-unrealistic-expectations-b75c7039445d'
      };
      let me=this;
      $.post('/api/articles/modaldata', materialObject).done((response) => {
         materialObj.ogdata = _.extend({
          title: materialObj.material_title,
          url: materialObj.url
         }, response.result);
         me.setState({ 'material_obj': materialObj });
         me.toggle();
      });
    } else {
      this.setState({ 'material_obj': materialObj });
      this.toggle();
    }
  }

  toggleClassList() {
      this.setState({
          isClassVisible: !this.state.isClassVisible
      });
  }


  componentWillReceiveProps(props) {
    debugger;
    if (props.classPageDetails) {
      if(props.classPageDetails.class_status == 'completed') {
        let activeTask = ((props.classPageDetails.lessons.length && props.classPageDetails.lessons.length != 0) && props.classPageDetails.lessons[0].tasks.length) ? props.classPageDetails.lessons[0].tasks[0] : undefined;
        this.setState({ 
          'classCompleted': true,
          'activeTaskObj': activeTask,
          'activetaskId': activeTask ? activeTask.task_id : undefined,
          'activeLessonObj': props.classPageDetails.lessons[0]
        });
      } else if (this.state.completedTaskId == '') {
        if (this.state.completedActionId != '') {
          let remainingActions = _.find(props.classPageDetails.lessons, { 'lesson_status': 'started' });
          if (!remainingActions && !remainingActions.action_id) {
            remainingActions = _.find(props.classPageDetails.lessons, { 'lesson_status': 'locked' });
            if (!remainingActions && !remainingActions.action_id) {
              this.setState({ 'classCompleted': true });
            }
          }
        } else {
          let lastIndex = _.findLastIndex(props.classPageDetails.lessons, { 'lesson_status': 'started' });
          let activeLessonObj = '';
          if (lastIndex >= 0) {
            activeLessonObj = _.nth(props.classPageDetails.lessons, lastIndex);
          } else {
            activeLessonObj = _.find(props.classPageDetails.lessons, { 'lesson_order': 1 });
          }
          if (activeLessonObj && activeLessonObj.tasks && activeLessonObj.tasks.length > 0) {
            let lastIndexTask=_.findLastIndex(activeLessonObj.tasks, { 'task_status': 'started' });
            if(lastIndexTask >= 0){
              const activeTaskObj = _.find(activeLessonObj.tasks, { 'task_status': 'started' });
              this.setState({'activetaskId':activeTaskObj.task_id});
              this.setState({ 'activeLessonObj': activeLessonObj, 'activeTaskObj': activeTaskObj });
            }else if(activeLessonObj.action_status != 'completed'){
              const activeActionObj = {
                'action_id': activeLessonObj.action_id,
                'action_status': activeLessonObj.action_status,
                'action_description': activeLessonObj.action_description,
                'lesson_id': activeLessonObj.lesson_id,
                'lesson_order':activeLessonObj.lesson_order
              };
              this.setState({'activetaskId':activeLessonObj.action_id});
              this.setState({ 'activeLessonObj': activeLessonObj, 'activeActionObj': activeActionObj });
            }else{
              const activeTaskObj = _.find(activeLessonObj.tasks, { 'task_order': 1 });
              this.setState({'activetaskId':activeTaskObj.task_id});
              this.setState({ 'activeLessonObj': activeLessonObj, 'activeTaskObj': activeTaskObj });
            }
          } else {
            activeLessonObj = _.find(props.classPageDetails.lessons, { 'action_status': 'started' });
            if (activeLessonObj && activeLessonObj.action_id) {
              const activeActionObj = {
                'action_id': activeLessonObj.action_id,
                'action_status': activeLessonObj.action_status,
                'action_description': activeLessonObj.action_description,
                'lesson_id': activeLessonObj.lesson_id,
                'lesson_order':activeLessonObj.lesson_order
              };
              this.setState({'activetaskId':activeLessonObj.action_id});
              this.setState({ 'activeLessonObj': activeLessonObj, 'activeActionObj': activeActionObj });
            } else {
              activeLessonObj = props.classPageDetails.lessons[0];
              //activeLessonObj.class_status="completed";
              const activeTaskObj = activeLessonObj.tasks[0];
              this.setState({'activetaskId':activeTaskObj.task_id});
              this.setState({ 'activeLessonObj': activeLessonObj, 'activeTaskObj': activeTaskObj, 'classStatus': 'completed' });
            }
          }
        }
      }
    }
  }

  render() {

    return (
    <ChildPage childPageType='classPage' backLink='/user/dashboard' backText='Back to Dashboard' classListStatus={this.state.isClassVisible} toggleClassList={this.toggleClassList}>
        <Modal isOpen={this.state.modal} toggle={this.toggle} >
          <ViewTaskModal bookmarking={this.bookmarking} completeTaskAction={this.taskComplete} materialFrom="classPage" materialObj={this.state.material_obj} closeModal={this.toggle} saveBugReport = {this.saveBug}/>
        </Modal>
        <div className="d-flex">
          <ClassList activetaskId={this.state.activetaskId} openActionDetails={this.actionDetailsPage} classSatus={this.state.classStatus} openTaskDetails={this.taskDetailsPage} classDetails={this.props.classPageDetails} classListStatus={this.state.isClassVisible}/>
          {this.props.classPageDetails.class_status == 'completed' && this.state.currentClassStatus == 'completed' ? 
          <div className="classroom-wrapper is-completed">
            <div>
              <label>Class</label>
              <h1>{this.props.classPageDetails.class_name}</h1>
              <Isvg src="/assets/icon-check-white.svg"></Isvg>

            </div>
          </div>
          :
          <ClassRoom previousTask={this.previousTask} nextTask={this.nextTask} classListStatus={this.state.isClassVisible} classCompleted={this.state.classCompleted} updateActions={this.updateActionsStatus} classSatus={this.state.classStatus} lessonCompleted={this.state.lessonStatus} completedLessonScreenId={this.state.completedLessonScreenId} completedTaskId={this.state.completedTaskId} completedPointsScreenId={this.state.completedPointsScreenId} readMaterial={this.readMaterial} classDetails={this.props.classPageDetails} activeLesson={this.state.activeLessonObj} activeTask={this.state.activeTaskObj} activeAction={this.state.activeActionObj}/>}

        </div>
    </ChildPage>
    );
  }
}


function mapStateToProps(state) {
  return {
    classPageDetails:state.classPageDetails
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
)(Class);
