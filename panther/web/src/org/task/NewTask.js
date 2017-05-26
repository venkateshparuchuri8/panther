import React, { Component } from 'react';
import { Button, Input, FormGroup, Label, Form , FormFeedback} from 'reactstrap';
import cookie from 'react-cookie';
import {validate} from '../../validators';


class NewTask extends Component {
  constructor(props) {
    super(props);
    console.log('props');
   console.log(props);

    this.state = {
      questions:[],
      materialflag:props.materialflag,
      task_name:props.taskTitle,
      description:props.taskdescription,
      'errors':{},
      buttonDisabled : true

    };
    this.materialModel=this.materialModel.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.addMaterial = this.addMaterial.bind(this);
    this.resetaction = this.resetaction.bind(this);
    this.createTask = this.createTask.bind(this);
    this.checkTheFields=this.checkTheFields.bind(this);
    this.getTaskData=this.getTaskData.bind(this);
  }

  handleChange(e, validators = []){
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
    this.setState({errors, [e.target.name]: e.target.value});
    if(this.state.task_name && this.state.description && Object.keys(this.state.errors).length == 0){
      this.setState({buttonDisabled : false});
    }else{
      this.setState({buttonDisabled : true});
    }


  }
  checkTheFields(){
    if(this.state.task_name && this.state.description && Object.keys(this.state.errors).length == 0){
      this.setState({buttonDisabled:false});
    }else{
      this.setState({buttonDisabled : true});
    }
  }
  createTask(e){
  e.preventDefault();
   const taskObj={};
    taskObj.title=this.state.task_name;
    taskObj.description=this.state.description;
    taskObj.points=100;
    taskObj.material_id=this.props.materialId;
    taskObj.created_user=cookie.load('org_obj').user_id;
    taskObj.modified_user=cookie.load('org_obj').user_id;
    if(this.state.taskId){
      taskObj.id=this.state.taskId;
    }

    this.props.addNewTaskCallback(taskObj);
  }

  getTaskData() {
    return {
      title: this.state.task_name,
      description: this.state.description
    }
  }
  
  materialModel(event){
    event.preventDefault();
    const obj={};
    obj.tasktitle=this.state.task_name;
    obj.taskdescription=this.state.description;
    console.log(obj);
    this.props.selectExistingMaterialCallback(obj);
  }

  addMaterial(e){
    e.preventDefault();
    this.props.addMaterialCallback(true);
    const obj = {};
    obj.taskTitle = this.state.task_name;
    obj.description = this.state.description;
    if(this.props.taskDataCallback) this.props.taskDataCallback(obj);
  }

  componentWillReceiveProps(props) {
    if(this.props.tasksList){
      this.setState({
      'task_name': '',
      'description': '',
      'taskId':'',
      'materialId':'',
      'heroImage':''
      });
    }else{
    this.setState({
      'task_name':props.taskTitle,
      'taskId':props.taskId,
      'description':props.taskdescription,
      'material':false,
      'materialflag':(props.formStatusTask == 'edit')? true : false,

    });
    }
  }

  resetaction(){
    this.setState({
      task_name:'',
      description:'',
      materialflag:false,
      material:false
    });
  }
  render() {
    let {errors} = this.state;
    return (
      <div>
    <Form onChange={this.checkTheFields}>
     <FormGroup color={errors.task_name ? "danger" : ""}>
      <Label for="task_name">Task Title</Label>
      <Input type="text" placeholder="Enter a title for this task" name="task_name" disabled={this.props.materialflag} value={this.state.task_name} onChange={(e) => this.handleChange(e, ['required'])}/>
      {errors.task_name ? <FormFeedback>{errors.task_name}</FormFeedback> : "" }
    </FormGroup>
    <FormGroup color={errors.description ? "danger" : ""}>
      <Label for="description">Task Description</Label>
      <Input type="text" placeholder="Enter a description for this task" name="description"  value={this.state.description} onChange={(e) => this.handleChange(e, ['required'])}/>
      {errors.description ? <FormFeedback>{errors.description}</FormFeedback> : "" }
    </FormGroup>
    <FormGroup>
      <Label for="exampleEmail">XP: <b>100</b></Label>
    </FormGroup>
    <FormGroup>
    <div className="pt-1 text-right text-muted font-italic">*Additional Content</div>
     <div className="mt-3">
      <Button size="lg" color="primary" disabled={this.props.materialflag || this.state.buttonDisabled} onClick={this.addMaterial}>Add New Material</Button>{' '}
      {/*<Button size="lg" color="primary" disabled={this.props.materialflag || this.state.buttonDisabled} onClick={this.materialModel}>Select from Library*</Button>*/}
    </div>
    </FormGroup>
    </Form>


  </div>
    );
  }
}



export default NewTask;
