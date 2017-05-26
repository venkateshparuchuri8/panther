import React, { Component} from 'react';
import { Row, Col, Button, FormGroup, Input } from 'reactstrap';
import Isvg from 'react-inlinesvg';
import cookie from 'react-cookie';
import moment from 'moment';
import ClassRoomHeader from './classRoomHeader';


class ClassRoom extends Component {

  constructor(props) {
    super(props);
    this.state={
      activeLessonObj:{},
      activeTaskObj:{},
      showLessonPoints:'hide',
      overlay:true,
      showClassPoints:'hide'
    };
    this.taskTypeIcon=this.taskTypeIcon.bind(this);
    this.taskTime=this.taskTime.bind(this);
    this.getTaskDuration=this.getTaskDuration.bind(this);
    this.readTaskMaterial=this.readTaskMaterial.bind(this);
    this.takeAction=this.takeAction.bind(this);
    this.actionSubmit=this.actionSubmit.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.showClasspoints=this.showClasspoints.bind(this);
    this.previousTask=this.previousTask.bind(this);
    this.nextTask=this.nextTask.bind(this);
  }

  handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
  }

  showClasspoints(){
    this.setState({'showClassPoints':'show'});
  }

  previousTask(currentObj,type){
    console.log(currentObj);
    this.props.previousTask(currentObj,type);
  }
   
  nextTask(currentObj,type){
    console.log(currentObj);
    this.props.nextTask(currentObj,type);
  }


  actionSubmit(obj){
    const actionObj = {};
    actionObj.action_id = obj.action_id;
    actionObj.user_id = cookie.load('user_obj').user_id;
    actionObj.action_response = this.state.action_responce;
    actionObj.modified_user =cookie.load('user_obj').user_id;
    actionObj.lesson_id=obj.lesson_id;
    this.props.updateActions(actionObj);
  }

  readTaskMaterial(task_obj){
    this.setState({'overlay':true});
    if(task_obj.task_status != 'locked'){
   this.props.readMaterial(task_obj);
   }
  }
  takeAction(event){
    event.preventDefault();
    this.setState({'overlay':!this.state.overlay});
  }

  getTaskDuration(est_time) {
    if(!est_time) return null;
    return moment.duration(est_time).humanize();
  }

  taskTime(task){

    if(task.material_type == 'Quiz' || task.material_type == 'Reflection') return;

    let timeText = '', taskDuration;

    if(!(taskDuration = this.getTaskDuration(task.estimated_time))) return;

    switch(task.material_type) {
      case 'Video':
        timeText = taskDuration + ' watch';
        break;
      case 'PDF':
        timeText = taskDuration + ' read';
        break;
      case 'Link':
        timeText = taskDuration + ' read';
        break;
      case 'Article':
        timeText = taskDuration + ' read';
        break;
      case 'Editor':
        timeText = taskDuration + ' read';
        break;
      case 'Podcast':
        timeText = taskDuration + ' listen';
        break;
      default:
        return;
    }

    return (
      <div className="time">
        <Isvg src="/assets/article-time.svg"></Isvg>
        <span className="ml-2">{timeText}</span>
      </div>
    );

  }

  taskTypeIcon(material_type){
    if(material_type == 'Video'){
      return(
        <div>
        <img className="mb-2" src="/assets/video-white.svg"/>
                <p>Watch this video</p>
                </div>
        );
    }
    if(material_type == 'PDF'){
      return(
        <div>
        <img className="mb-2" src="/assets/pdf-white.svg"/>
                <p>Read this pdf</p>
                </div>
        );
    }
    if(material_type == 'Link'){
      return(
        <div>
        <img className="mb-2" src="/assets/link-white.svg"/>
                <p>See this link</p>
                </div>
        );
    }
    if(material_type == 'Article'){
      return(
        <div>
        <img className="mb-2" src="/assets/article-white.svg"/>
                <p>Read this article</p>
                </div>
        );
    }
    if(material_type == 'Editor'){
      return(
        <div>
        <img className="mb-2" src="/assets/editor-white.svg"/>
                <p>Read this article</p>
                </div>
        );
    }
    if(material_type == 'Quiz'){
      return(
        <div>
        <img className="mb-2" src="/assets/quiz-white.svg"/>
                <p>Take this quiz</p>
                </div>
        );
    }
    if(material_type == 'Reflection'){
      return(
        <div>
        <img className="mb-2" src="/assets/reflection-white.svg"/>
                <p>Take this reflection</p>
                </div>
        );
    }
    if(material_type == 'Podcast'){
      return(
        <div>
        <img className="mb-2" src="/assets/audio-white.svg"/>
                <p>Listen to this podcast</p>
                </div>
        );
    }

  }

  render() {
    return (
    <div className={this.props.classListStatus ? "classroom-wrapper w-50" : "classroom-wrapper"}>
    <ClassRoomHeader completedLessonScreenId={this.props.completedLessonScreenId} lessonCompleted={this.props.lessonCompleted} activeLesson={this.props.activeLesson} classDetails={this.props.classDetails}/>
      

      <div className="classroom-content">
        {this.props.activeAction && this.props.activeAction.action_id ?
        <h1 className="classroom-content-title">{this.props.activeLesson.lesson_order}.{this.props.activeLesson.tasks.length+1} Action Time</h1>
        :
        <h1 className="classroom-content-title">{this.props.activeLesson.lesson_order}.{this.props.activeTask.task_order} {this.props.activeTask.task_name}</h1>
        }
          {this.props.activeAction && this.props.activeAction.action_id ? 
          <div className="classroom-scroller">
            <div onClick={this.previousTask.bind(this,this.props.activeAction,'action')}>
              <Isvg src="/assets/classroom-arrow-up.svg"></Isvg>
            </div>
            <div onClick={this.nextTask.bind(this,this.props.activeAction,'action')}>
              <Isvg src="/assets/classroom-arrow-down.svg"></Isvg>
            </div>
          </div>
          :
          <div className="classroom-scroller">
            <div onClick={this.previousTask.bind(this,this.props.activeTask,'task')}>
              <Isvg src="/assets/classroom-arrow-up.svg"></Isvg>
            </div>
            <div onClick={this.nextTask.bind(this,this.props.activeTask,'task')}>
              <Isvg src="/assets/classroom-arrow-down.svg"></Isvg>
            </div>
          </div>
          }


        <Row>
        {this.props.activeAction && this.props.activeAction.action_id ?

          <Col md="10" lg="10" xl="8" className="mx-auto">
            <div className={this.state.overlay ? "actions-wrapper" : "actions-wrapper in-progress"} >
             {this.props.activeAction.action_status != "locked"?
             <div>
              {this.state.overlay && this.props.activeAction.action_status != "completed"? 
              <div className="actions-wrapper-overlay">
                <div className="take-action" onClick={this.takeAction}>
                  <Isvg src="/assets/icon-actions.svg"></Isvg>
                  <p>Take this action</p>
                </div>
              </div>: ''}
              </div>
              : <div className="actions-wrapper-overlay is-locked">
                <div className="take-action">
                  <Isvg className="mb-2" src="/assets/icon-lock-white.svg"></Isvg>
                   <p>Locked</p>
                </div>
              </div>}

              <div className="actions-wrapper-header">
                <div className="actions-wrapper-header-name">Action Time!</div>
                <div className="actions-wrapper-header-actions">
                  <span className="report-bug"><Isvg src="/assets/icon-report-bug.svg"></Isvg> Report a bug</span>
                  <span onClick={this.takeAction}><Isvg src="/assets/icon-close.svg" ></Isvg></span>
                </div>
              </div>

              <div className="actions-wrapper-content">
                <div className="actions-wrapper-question">
                {this.props.activeAction.action_description}
                </div>
                <div className="actions-wrapper-answer">
                  <FormGroup>
                    <Input type="textarea" name="action_responce" placeholder="Reflect on this expirence to complete this action.." value={this.state.action_responce} onChange={this.handleChange} />
                  </FormGroup>
                  <small className="text-danger">Please input at least 100 characters</small>
                </div>
                <div className="actions-wrapper-submit float-right">
                  <Button size="sm" color="primary" className="btn-start" onClick={this.actionSubmit.bind(this,this.props.activeAction)}>
                    <Isvg src="/assets/icon-check-white.svg"></Isvg>Submit
                  </Button>
                </div>
              </div>
            </div>
          </Col>
          :
          <Col md="10" lg="10" xl="7" className="mx-auto">
            {this.props.completedTaskId == this.props.activeTask.task_id ?
              <div>
               {this.props.completedPointsScreenId == this.props.activeTask.task_id ?
                <div className="classroom-content-material is-completed" style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' + this.props.activeTask.material_image + ')',backgroundRepeat: 'no-repeat',backgroundSize: 'cover', backgroundPosition: 'center'}}>
                  <div onClick={this.readTaskMaterial.bind(this,this.props.activeTask)}>
                  <Isvg src="/assets/icon-check-white.svg"></Isvg>
                  <p>{this.props.activeTask.task_points} XP earned</p>

                  <div className={this.props.activeTask.bookmarked == 1 ? "bookmark is-active" : "bookmark"}><Isvg src="/assets/icon-bookmark-white.svg"></Isvg></div>
                  
                  {this.taskTime(this.props.activeTask)}

                </div>
                </div>
                :
                
                <div className="classroom-content-material-completed">
                <div>
                  <h3>Congratulations!</h3>
                  <p className="text-muted">You've successfully completed this task. Your rewards is:</p>
                  <h2>{this.props.activeTask.task_points} XP</h2>
                  </div>
                </div>
                }
              </div>
            :<div className={this.props.activeTask.task_status == 'completed' ? "classroom-content-material is-completed" : (this.props.activeTask.task_status == 'locked' ? "classroom-content-material is-locked" : "classroom-content-material") } style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' + this.props.activeTask.material_image + ')',backgroundRepeat: 'no-repeat',backgroundSize: 'cover', backgroundPosition: 'center'}}>
                {this.props.activeTask.task_status != 'locked' ?
                <div onClick={this.readTaskMaterial.bind(this,this.props.activeTask)}>
                  {this.taskTypeIcon(this.props.activeTask.material_type)}

                  <div className={this.props.activeTask.bookmarked == 1 ? "bookmark is-active" : "bookmark"}><Isvg src="/assets/icon-bookmark-white.svg"></Isvg></div>
                  
                  {this.taskTime(this.props.activeTask)}

                </div>
                :
                <div>
                  <div>
                   <Isvg className="mb-2" src="/assets/icon-lock-white.svg"></Isvg>
                   <p>Locked</p>
                  </div>

                  {this.taskTime(this.props.activeTask)}

                </div>
                }  

              </div>
            }
          </Col>
        }
        </Row>


        {this.props.activeAction && this.props.activeAction.action_id ? '':
          <Row>
            <Col md="8" className="mx-auto mt-2">
              <p className="text-muted">{this.props.activeTask.task_description}</p>
            </Col>
          </Row>
        }

      </div>
    </div>

    );
  }
}



export default ClassRoom;
