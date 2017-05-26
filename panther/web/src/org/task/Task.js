import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CoursePage from './CoursePage';
import { Button} from 'reactstrap';
import * as actions from '../common/actions/index';
//import {Link} from 'react-router';
import TaskActionEditCreate from './TaskActionEditCreate';
import TaskList from './TaskList';
let _ = require('lodash');
import cookie from 'react-cookie';
import $ from 'jquery';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskConfig: {
        showTask: true,
        taskType: 'create',
        showAction: true,
        actionType: 'create',
        data: {}
      },
      modal: false,
      showCreateForm:false,
      formStatusT:'create',
      formStatusA:'create',
      actions_count:0,
      quiz_count:0,
      reflection_count:0,
      class_status:'published',
      materialflag:false,
      material:false,
      tabIndex: 0
    };
    this.addNewActions=this.addNewActions.bind(this);
    this.editActionElement=this.editActionElement.bind(this);
    this.selectedMaterial=this.selectedMaterial.bind(this);
    this.addTaskNew=this.addTaskNew.bind(this);
    this.editTaskElement=this.editTaskElement.bind(this);
    this.showAllTabs=this.showAllTabs.bind(this);
    this.addTask=this.addTask.bind(this);
    this.material = this.material.bind(this);
    this.addingMaterialFun = this.addingMaterialFun.bind(this);
    this.questionsdata =this.questionsdata.bind(this);
    this.taskDetails = this.taskDetails.bind(this);
  }

  componentDidMount() {
    this.props.actions.viewCourse(this.props.params.courseId);
    this.props.actions.getAllActions(this.props.params.id);
    this.props.actions.getAllTasks(this.props.params.id);
    // this.props.actions.getAllMaterials(cookie.load('org_obj').org_id);
    $.post('/api/class/'+this.props.params.classId+'').done((response) =>{
      if(response.result.status == 'published') {
        this.setState({
          'class_status':response.result.status,
          taskConfig: {
            showTask: false,
            taskType: 'edit',
            showAction: false,
            actionType: 'edit',
            data: {}
          }
        });
      } else {
        this.setState({'class_status':response.result.status});
      }
    });
    $.post('/api/lesson/'+this.props.params.id+'').done((response) =>{
       this.setState({'lesson_name':response.result.name,'actions_count':response.result.actions_count,'quiz_count':response.result.quiz_count,'reflection_count':response.result.reflection_count});
    });
  }

  showAllTabs(event){
    event.preventDefault();
    this.setState({
      taskConfig: _.extend(this.state.config, {
        showTask: true,
        showAction: true,
        actionType: 'create',
        taskType: 'create',
        data: null
      })
    });
    // this.setState({'showCreateForm':true,formStatusT:'create',formStatusA:'create'});
    // this.setState({'description':'','action_id':''});
    // this.setState({'materialId':'','heroImage':'','taskTitle' :'','taskdescription':'','taskId':'','materialflag':false,material:false});
  }

  addNewActions(obj){
    obj.lesson_id=this.props.params.id;
    if(obj.id){
    this.props.actions.updateAction(obj);
    }else{
      this.setState({'actions_count':1});
    this.props.actions.createAction(obj);
    }
  }

  addTask(object){
    const taskObj={};
    taskObj.task_title=this.state.taskTitle;
    taskObj.task_description=this.state.taskdescription;
    taskObj.points=100;
    taskObj.material_id=this.props.materialId;
    taskObj.created_user=cookie.load('org_obj').user_id;
    taskObj.modified_user=cookie.load('org_obj').user_id;
    taskObj.user_id = cookie.load('org_obj').user_id;
    taskObj.material_title = object.title;
    taskObj.content = object.content;
    taskObj.author = object.author;
    taskObj.hero_image = object.hero_image;
    taskObj.estimated_time = object.estimated_time;
    taskObj.questions = object.questions;
    taskObj.material_type = object.material_type;
    taskObj.question = object.question;
    if(this.state.taskId){
      taskObj.task_id=this.state.taskId;
    }

    this.addTaskNew(taskObj);
    this.setState({
      'showCreateForm':true,
      formStatusT:'create',
      formStatusA:'create',
      'materialId':'',
      'heroImage':'',
      'taskTitle' :'',
      'taskdescription':'',
      'taskId':''
    });
  }

  addTaskNew(obj){
    obj.lesson_id=this.props.params.id;
    if(obj.task_id){
      if(obj.material_type == 'Quiz'){
        this.props.actions.updateQuizTask(obj);
      }else if(obj.material_type == 'Reflection'){
        this.props.actions.updateReflectionTask(obj);
      }else{
        this.props.actions.updateTask(obj);
      }
    }else{
    this.props.actions.createTask(obj);
    }
  }

  material (flag){
    this.setState({materialflag:true,questions:[],material:flag});
  }

  questionsdata(questions){
    const questiondata = questions.map((obj) => {
      return obj.answer = obj.options[0].option;
    });
    console.log(questiondata);
    this.setState({questions:JSON.stringify(questions)});
  }

  editActionElement(action_id){

    this.setState({
      taskConfig: _.extend(this.state.config, {
        showTask: false,
        showAction: true,
        actionType: 'edit',
        data: {
          id: action_id
        }
      })
    });

    // const actionObj=_.find(this.props.actionsList,{'id':parseInt(action_id)});
    // this.setState({
    //   'showCreateForm': true,
    //   'formStatusA': 'edit',
    //   tabIndex: 1,
    //   material: false,
    //   materialflag: false,
    //   'description':actionObj.description,
    //   'action_id':actionObj.id
    // });
  }

  editTaskElement(task_id){
    this.setState({
      taskConfig: _.extend(this.state.config, {
        showTask: true,
        taskType: 'edit',
        showAction: false,
        data: {
          id: task_id
        }
      })
    });
    // this.setState({
    //   'showCreateForm': true,
    //   'formStatusT': 'edit',
    //   'materialObj': {},
    //   material: true,
    //   materialflag: true,
    //   tabIndex: 0
    // });

    // const taskObj=_.find(this.props.tasksList,{'id':parseInt(task_id)});

    // var materialObj=_.find(this.props.materials,{'id':parseInt(taskObj.material_id)});

    // if(materialObj) {
    //   this.setState({
    //     'taskTitle':taskObj.title,
    //     'taskId':taskObj.id,
    //     'taskdescription':taskObj.description,
    //     'materialId':taskObj.material_id,
    //     'heroImage':materialObj.hero_image,
    //     'formStatusT':'edit',
    //     'materialObj':materialObj,
    //     'material_type':taskObj.material_type
    //   });
    // } else if(taskObj.material_type == 'Quiz') {
    //   let data= this;
    //   $.ajax({
    //     type: "GET",
    //     contentType: "application/json",
    //     url: '/api/quiz/task/getquizdetails?task_id=' + taskObj.id,
    //     dataType: "json",
    //     success: function(response) {
    //       if(response){
    //           data.setState({
    //             'materialObj':response.result,
    //             'taskTitle':taskObj.title,
    //             'taskId':taskObj.id,
    //             'taskdescription':taskObj.description,
    //             'formStatusT':'edit',
    //             'material_type':taskObj.material_type
    //           });
    //         }
    //       }
    //   });
    // } else if(taskObj.material_type == 'Reflection') {
    //   let data= this;
    //   $.ajax({
    //     type: "GET",
    //     contentType: "application/json",
    //     url: '/api/tasks/reflection/getReflectionDetails/' + taskObj.id,
    //     dataType: "json",
    //     success: function(response) {
    //       if(response){
    //         data.setState({
    //           'materialObj':response.result[0],
    //           'taskTitle':taskObj.title,
    //           'taskId':taskObj.id,
    //           'taskdescription':taskObj.description,
    //           'formStatusT':'edit',
    //           'material_type':taskObj.material_type
    //         });
    //       }
    //     }
    //   });
    // }
  }

  selectedMaterial(material_id){
    var materialObj=_.find(this.props.materials,{'id':parseInt(material_id)});
    this.setState({'heroImage':materialObj.hero_image,'materialId':materialObj.id});
  }

  addingMaterialFun(obj){
   const taskObj={};
    taskObj.task_title=this.state.taskTitle;
    taskObj.description=this.state.taskdescription;
    taskObj.type = obj.type;
    taskObj.modified_user=cookie.load('org_obj').user_id;
    taskObj.user_id = cookie.load('org_obj').user_id;
    taskObj.created_user = cookie.load('org_obj').user_id;
    taskObj.organization_id = cookie.load('org_obj').org_id;
    if(obj.type == 'Quiz'){
     taskObj.questions = this.state.questions;
     taskObj.points=100;

    }else if(obj.type == 'Reflection'){
      taskObj.question=obj.question;
    } else {
    taskObj.title = obj.title;
    taskObj.author = obj.author;
    taskObj.estimated_time = obj.estimated_time;
    taskObj.url = obj.url;
    taskObj.hero_image = obj.hero_image;
    taskObj.content = obj.content;

    }
     taskObj.lesson_id = this.props.params.id;
    if(taskObj.type == 'Quiz'){
      this.setState({'quiz_count':1});
    this.props.actions.createQuiz(taskObj);
    }
    else if(taskObj.type == 'Reflection'){
      this.setState({'reflection_count':1});
      this.props.actions.createReflection(taskObj);
    } else{
      this.props.actions.createMaterialInTask(taskObj);
    }
    this.setState({
      materialflag:false,
      material:false,
      questions:[],
      taskTitle:'',
      taskdescription:''
      });
  }
  taskDetails(obj){
  this.setState({taskTitle:obj.taskTitle,taskdescription:obj.description});

  }

  componentWillReceiveProps(props){
    if(props.tasksList){
      this.setState({
      'taskTitle': '',
      'taskdescription': '',
      'taskId':'',
      'materialId':'',
      'heroImage':''
    });
    }
    if(props.actionsList){
      this.setState({
      'action_id': '',
      'description': ''
    });
    }
  }
  render() {

    return (
    <CoursePage courseId={this.props.params.courseId} classId={this.props.params.classId}>
      <div className="course-page">
        <aside className="course">
          <div className="course-title">
            <div className="course-title-status">{this.state.class_status}</div>
            <h4>{this.props.viewcourses.name}</h4>
            <div className="course-title-description">{this.state.lesson_name}</div>
          </div>
          {this.state.class_status == 'published' ? '' :
            <div className="course-action"> <Button block size="lg" color="primary" onClick={this.showAllTabs}>New Task/ New Action</Button></div>
          }
          <TaskList editActionElement={this.editActionElement} actionsList={this.props.actionsList} editTaskElement={this.editTaskElement} tasksList={this.props.tasksList} material={false}/>
        </aside>
        <div>
          <div className="course-page-body">
            <section className="course-body pl-6 pr-6">
              <TaskActionEditCreate lessonId={this.props.params.id} actionsList={this.props.actionsList} tasksList={this.props.tasksList} config={this.state.taskConfig} />
            </section>
          </div>
        </div>
      </div>
    </CoursePage>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    viewcourses: state.courseView,
    actionsList:state.actions,
    tasksList: state.tasks,
    auth: state.auth
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
