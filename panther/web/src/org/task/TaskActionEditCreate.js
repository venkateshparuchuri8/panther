import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tab,Tabs,TabPanel,TabList} from 'react-tabs';
import {Row,Col} from 'reactstrap';
import CreateMaterial from '../libraries/CreateMaterial';
import EditMaterial from './EditMaterialInTask';
import NewTask from './NewTask';
import NewAction from './NewAction';
import * as actions from '../common/actions/index';
import cookie from 'react-cookie';
let _ = require('lodash');
//import $ from 'jquery';

class TaskActionEditCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			config: props.config,
			task: null,
			action: null,
			tabIndex: 0,
			modal: false,
			questions: [],
			showMaterialBody: false,
			materialType: ''
		}
		this.updateActiveItem = this.updateActiveItem.bind(this);
		this.updateStateConfig = this.updateStateConfig.bind(this);
		this.addUpdateTask = this.addUpdateTask.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.existingMaterialSelectedCallback = this.existingMaterialSelectedCallback.bind(this);
		this.addMaterialToNewTask = this.addMaterialToNewTask.bind(this);
		this.saveQuestionsData = this.saveQuestionsData.bind(this);
		this.saveReflectionData = this.saveReflectionData.bind(this);
		this.updateMaterialData = this.updateMaterialData.bind(this);
		this.setShowAddMaterial = this.setShowAddMaterial.bind(this);
		this.persistTaskData = this.persistTaskData.bind(this);
    this.addNewAction = this.addNewAction.bind(this);
	}

	componentDidMount() {
		this.setState({
			config: _.extend(this.state.config, this.props.config),
			tabIndex: 0
		});
		this.props.actions.getAllMaterials(cookie.load('org_obj').org_id);
		this.props.actions.getAllReflections(cookie.load('org_obj').org_id);
		this.props.actions.getAllQuizzes(cookie.load('org_obj').org_id);
		this.updateActiveItem(this.props);
		this.updateStateConfig();
	}

	componentWillReceiveProps(nextProps) {
		if(this.props === nextProps) return;
		this.setState({
			config: _.extend(this.state.config, nextProps.config),
			tabIndex: 0
		});
		this.updateActiveItem(nextProps);
		this.updateStateConfig();
	}

	updateActiveItem(props) {
		if(this.state.config.data == null) {
			return this.setState({
				task: null,
				action: null,
				material: null,
				questions: [],
				showMaterialBody: false,
				materialType: ''
			});
		}
		//setting active item, either task or action and also setting material
		let active_item = this.state.config.data.id, active_task, active_action;
		console.log(active_item);
		active_task = _.find(props.tasksList, (t) => t.id == this.state.config.data.id);
		if(!active_task) active_action = _.find(props.actionsList, (a) => a.id == this.state.config.data.id);
		else {
			this.setState({
				task: active_task
			});
		} if(active_action) this.setState({
			action: active_action
		});

		active_item = active_task || active_action;
		let active_item_type = active_task ? active_task.material_type : 'Action';
		if(active_item_type == 'Quiz') {
			console.log(active_task);
			let quiz = _.find(props.quizzesList, (a) => a.material_id == active_task.material_id);
			this.setState({
				showMaterialBody: true,
				material : quiz ? quiz.questions : null,
				materialType: active_item_type
			});

		} else if(active_item_type == 'Reflection') {
			console.log(active_task);
			let reflection = _.find(props.reflectionsList, (a) => a.material_id == active_task.material_id);
			this.setState({
				showMaterialBody: true,
				material : reflection,
				question: reflection.question,
				materialType: active_item_type
			});
		} else if(active_item_type != 'Action') {
			this.setState({
				showMaterialBody: true,
				materialType: active_item_type,
				material: _.find(props.materialsList, (m) => m.id == active_task.material_id)
			});
		} else {
			this.setState({
				material: null,
				materialType: active_item_type,
			})
		}
	}

	updateStateConfig() {
		this.setState({
			quiz_count: _.countBy(this.props.tasksList, (t) => t.material_type == 'Quiz'),
			reflection_count: _.countBy(this.props.tasksList, (t) => t.material_type == 'Reflection'),
			actions_count: this.props.actionsList.length
		})
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	existingMaterialSelectedCallback(id) {
		var materialObj=_.find(this.props.materialsList, {'id': parseInt(id) });
		console.log(materialObj);
		this.toggleModal();
	}

	addUpdateTask(obj) {
		obj.lesson_id=this.props.lessonId;
		if(obj.task_id){
			if(obj.material_type == 'Quiz'){
        obj.organization_id = cookie.load('org_obj').org_id;
				this.props.actions.updateQuizTask(obj);
			}else if(obj.material_type == 'Reflection'){
				obj.organization_id = cookie.load('org_obj').org_id;
				this.props.actions.updateReflectionTask(obj);
			}else{
				this.props.actions.updateTask(obj, cookie.load('org_obj').org_id);
			}
		}else{
			this.props.actions.createTask(obj);
		}
	}

	addMaterialToNewTask(material) {
		const taskObj = {};
		taskObj.task_title = this.state.task.title;
		taskObj.description = this.state.task.description;
		taskObj.type = material.type;
		taskObj.modified_user = cookie.load('org_obj').user_id;
		taskObj.user_id = cookie.load('org_obj').user_id;
		taskObj.created_user = cookie.load('org_obj').user_id;
		taskObj.organization_id = cookie.load('org_obj').org_id;

		if(material.type == 'Quiz'){
			taskObj.questions = this.state.questions;
			taskObj.points = 100;
		}else if(material.type == 'Reflection'){
			taskObj.question=this.state.question;
		} else {
			taskObj.title = material.title;
			taskObj.author = material.author;
			taskObj.estimated_time = material.estimated_time;
			taskObj.url = material.url;
			taskObj.hero_image = material.hero_image;
			taskObj.content = material.content;
		}

		taskObj.lesson_id = this.props.lessonId;

		if(taskObj.type == 'Quiz'){
			this.setState({
				quiz_count: this.state.quiz_count + 1
			});
			this.props.actions.createQuiz(taskObj);
		} else if(taskObj.type == 'Reflection'){
			this.setState({
				reflection_count: this.state.reflection_count + 1
			});
			this.props.actions.createReflection(taskObj);
		} else {
			this.props.actions.createMaterialInTask(taskObj);
		}

		this.setState({
			showMaterialBody: false,
			material: material,
			questions: [],
			question: null,
			task: null,
			action: null
		});
	}

	setShowAddMaterial() {
		this.setState({
			showMaterialBody:true,
			questions:[]
		});
	}

	saveQuestionsData(questions){
		const questiondata = questions.map((obj) => {
			return obj.answer = obj.options[0].option;
		});
		console.log(questiondata);
		this.setState({
			questions: JSON.stringify(questions)
		});
	}

	saveReflectionData(question){
		this.setState({
			question: question
		});
	}

	updateMaterialData(material) {
		const taskObj = {};
		var newTaskData = Object.assign(
            {},
            this._taskEditor.getTaskData()
        );
		taskObj.task_title = newTaskData.title;
		taskObj.task_description = newTaskData.description;
		taskObj.points = 100;
		taskObj.material_id = this.state.material.id;
		taskObj.created_user = cookie.load('org_obj').user_id;
		taskObj.modified_user = cookie.load('org_obj').user_id;
		taskObj.user_id = cookie.load('org_obj').user_id;
		taskObj.material_title = material.title;
		taskObj.content = material.content;
		taskObj.author = material.author;
		taskObj.hero_image = material.hero_image;
		taskObj.estimated_time = material.estimated_time;
		taskObj.questions = material.questions;
		taskObj.material_type = material.material_type;
		taskObj.question = material.question;

		if(this.state.task.id){
			taskObj.task_id = this.state.task.id;
		}

		this.addUpdateTask(taskObj);
		this.setState({
			material: material
		});
		// this.setState({
		// 	'showCreateForm':true,
		// 	formStatusT:'create',
		// 	formStatusA:'create',
		// 	'materialId':'',
		// 	'heroImage':'',
		// 	'taskTitle' :'',
		// 	'taskdescription':'',
		// 	'taskId':''
		// });
	}

	persistTaskData(task) {
		this.setState({
			task: _.extend(this.state.task, {
				title: task.taskTitle,
				description: task.description
			})
		});
	}

	addNewAction(action){
		debugger;
		action.lesson_id=this.props.lessonId;
		if(action.id) {
			this.props.actions.updateAction(action);
		} else {
			this.setState({ actions_count : this.state.actions_count + 1});
			this.props.actions.createAction(action);
		}
	}

	render() {
		return (
			<div>
				<Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
					<TabList>
						{this.state.config.showTask && <Tab>{this.state.config.taskType == 'create' ? 'New Task' : 'Edit Task'}</Tab>}
						{this.state.config.showAction && <Tab>{this.state.config.actionType == 'create' ? 'New Action' : 'Edit Action'}</Tab>}
					</TabList>
					{this.state.config.showTask && <TabPanel>
						<NewTask ref={(ref) => this._taskEditor = ref}
							quizCount={this.state.quiz_count}
							reflectionCount={this.state.reflection_count}
							formStatusTask={this.state.config.taskType}
							selectExistingMaterialCallback={this.toggleModal}
							heroImage={this.state.material ? this.state.material.hero_image : undefined}
							materialId={this.state.material ? this.state.material.id : undefined}
							materialobject={this.state.material}
							taskDataCallback={this.persistTaskData}
							addNewTaskCallback={this.addUpdateTask}
							materialflag = {this.state.material ? true : false}
							addMaterialCallback = {this.setShowAddMaterial}
							taskTitle={this.state.task ? this.state.task.title: ''}
							taskdescription={this.state.task ? this.state.task.description: ''}
							taskId={this.state.taskId}/>
						{this.state.showMaterialBody ?
							<section className="course-body">
								<Row>
									<Col>
										{this.state.config.taskType == 'create'?
											<div className={this.state.showMaterialBody ? "show p-0" : "hide" }>
												<CreateMaterial quizCount={this.state.quiz_count} resetClick={this.resetaction}
													reflectionCount={this.state.reflection_count}
													from="tasks"
													materialshow={this.state.material ? true : false}
													addMaterialsToTask={this.addMaterialToNewTask}
													questionslistCallback={this.saveQuestionsData}
													reflectionCallback={this.saveReflectionData} />
											</div>
											:
											<EditMaterial materialData={this.state.material} materialType={this.state.materialType} updateMaterialdataCallback={this.updateMaterialData}/>
										}
									</Col>
								</Row>
							</section> : ""
						}
						</TabPanel>}
					{this.state.config.showAction && <TabPanel><NewAction actionsCount={this.state.actions_count} formStatusAction={this.state.config.actionType} actionId={this.state.config.actionType == 'edit' ? this.state.config.data : undefined} description={this.state.action ? this.state.action.description : undefined} addNewActionCallback={this.addNewAction}/></TabPanel>}
				</Tabs>
				{/*<Modal isOpen={this.state.modal} toggle={this.toggleModal} className="auto">
					<ModalHeader toggle={this.toggleModal}>Select Material</ModalHeader>
					<SelectMaterial materialSelected={this.existingMaterialSelectedCallback} materials={this.props.materialsList}/>
				</Modal>*/}
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
		tasksList: state.tasks,
		actionsList: state.actions,
		materialsList: state.materials,
		reflectionsList: state.reflections,
		quizzesList: state.quizzes
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskActionEditCreate);
