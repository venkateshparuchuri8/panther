import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LessonPage from './lessonPage';
import { Button,  Input, FormGroup, Label, Form, Modal, ModalHeader, FormFeedback} from 'reactstrap';
import LessonsList from './lessonsList';
import * as actions from '../common/actions/index';
//import {Link} from 'react-router';
import cookie from 'react-cookie';
let _ = require('lodash');
import $ from 'jquery';
import UnsplashImages from '../common/components/ImagesFromUnspash';
import {validate} from '../../validators';


class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
       modal: false,
       published:false,
       showCreateCourse:false,
       editLessonObj:{},
       loading:false,
       formStatus:'create',
       class_status:'published',
       errors: {},
       buttonDisable:true
    };

    this.createLesson=this.createLesson.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.publishLesson=this.publishLesson.bind(this);
    this.editLessonPage=this.editLessonPage.bind(this);
    this.showCreateLessonForm=this.showCreateLessonForm.bind(this);
    this.taskActionsPage=this.taskActionsPage.bind(this);
    this.uploadPreview=this.uploadPreview.bind(this);
    this.previewImageUnspalsh=this.previewImageUnspalsh.bind(this);
    this.toggle=this.toggle.bind(this);
    this.cancelPreviewImage=this.cancelPreviewImage.bind(this);
    this.resetForm=this.resetForm.bind(this);
    this.checkTheFields=this.checkTheFields.bind(this);
  }
  handleChange(e, validators = []) {
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);  
    this.setState({errors, [e.target.name]: e.target.value});
    if(this.state.lesson_name && this.state.lesson_content  && this.state.preview_image && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }

    checkTheFields(){
    if(this.state.lesson_name && this.state.lesson_content && this.state.preview_image && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }

  componentDidMount() {
    this.props.actions.viewCourse(this.props.params.courseId);
    this.props.actions.getAllLessons(this.props.params.id);
    $.post('/api/class/'+this.props.params.id+'').done((response) =>{
       this.setState({'class_status':response.result.status});
    });
  }
  createLesson(event){
    event.preventDefault();
    const lessonObj={};
    lessonObj.name=this.state.lesson_name;
    lessonObj.description=this.state.lesson_content;
    lessonObj.hero_image=this.state.preview_image;
    lessonObj.points=100;
    lessonObj.status='drafted';
    lessonObj.class_id=this.props.params.id;
    lessonObj.course_id=this.props.params.courseId;
    lessonObj.created_user=this.props.auth.user_id || cookie.load('org_obj').user_id;
    lessonObj.modified_user=this.props.auth.user_id || cookie.load('org_obj').user_id;
    if(event.target.id){
      lessonObj.id=event.target.id;
      lessonObj.status=this.state.status;
      this.props.actions.updateLesson(lessonObj);
    }else{
      this.props.actions.createLesson(lessonObj);
    }

    this.setState({ showCreateCourse: false});

  }

  resetForm(event){
    event.preventDefault();
    if(this.state.formStatus == 'create'){
      this.setState({'lesson_id':'','lesson_name':'','lesson_content':'','preview_image':'','status':''});
    }else if(this.state.formStatus == 'edit'){
      this.setState({ showCreateCourse: false});
    }
  }

  publishLesson(lesson_id){
    $.post('/api/lesson/publish/'+lesson_id+'/'+this.props.params.id).done((response) =>{
       this.props.actions.updateStoreWithNewLessons(response.result);
       this.setState({'published':true});
    });
  }

  taskActionsPage(lesson_id){
    const path='/app/course/'+this.props.params.courseId+'/class/'+this.props.params.id+'/lesson/'+lesson_id;
    this.context.router.push(path);
  }

  editLessonPage(lesson_id, status){
    const lessonObject=_.find(this.props.lessons, { 'id': parseInt(lesson_id) });
    const editLessonObj=lessonObject;
    this.setState({'lesson_id':editLessonObj.id,'lesson_name':editLessonObj.name,'lesson_content':editLessonObj.description,'preview_image':editLessonObj.hero_image,'status':status, 'showCreateCourse':true,'formStatus':'edit'});
  }

  showCreateLessonForm() {
      this.setState({ showCreateCourse: true });
      this.setState({'lesson_id':'','lesson_name':'','lesson_content':'','preview_image':'','status':''});
  }

  cancelPreviewImage(event){
    event.preventDefault();
    this.setState({'preview_image':''});
    this.setState({ 'buttonDisable': true });
  }

  uploadPreview(event){
    event.preventDefault();
    const file = event.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      // This is a post request to server endpoint with image as `image`
      this.setState({'loading':true});
      const formData = new FormData();
      formData.append('image', file);
      fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
        headers:{
          'Access-Control-Allow-Origin':''
        },
      }).then((response) => {
        if (response.status === 200) {
          // Assuming server responds with
          // `{ "url": "http://example-cdn.com/image.jpg"}`
          return response.json().then(data => {
            if (data) {
              this.setState({'preview_image' :data.files[0].url});
              this.setState({'loading':false});

               if (this.state.lesson_name && this.state.lesson_content && this.state.preview_image) {
                   this.setState({ 'buttonDisable': false });
                  }
              //toastr.success("Image Uploaded Succesfully", "Success");
            }
          });
        }
      });
    }
  }

  toggle(e) {
    if(e){
    e.preventDefault();
    }
    this.setState({
      modal: !this.state.modal,
    });
  }

  previewImageUnspalsh(url){
    this.setState({'preview_image' :url});
    if (this.state.lesson_name && this.state.lesson_content && url) {
         this.setState({ 'buttonDisable': false });
     }
    this.toggle();
  }

  componentWillReceiveProps(props){
    if(props.lessons){
      this.setState({'lesson_id':'','lesson_name':'','lesson_content':'','preview_image':'','status':''});
    }
  }

  render() {
    let lessons=[];
     const {errors} = this.state;
    {this.props.lessons && this.props.lessons.length > 0 ? lessons=this.props.lessons : lessons=[]}
    return (
    <LessonPage courseId={this.props.params.courseId}>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>Select Image</ModalHeader>
        <UnsplashImages preview_unsplash={this.previewImageUnspalsh} modelClose={this.toggle}/>

      </Modal>

      <div className="course-page">
        <aside className="course">
          <div className="course-title">
            <div className="course-title-status">{this.state.class_status}</div>
            <h4>{this.props.viewcourses.name}</h4>
          </div>
          {this.state.class_status == 'published' ? '' :
          <div className="course-action"> <Button block size="lg" color="primary" onClick={this.showCreateLessonForm}>New Lesson</Button></div>}
          <LessonsList taskPage={this.taskActionsPage} editLessonPage={this.editLessonPage} publish={this.publishLesson} published={this.state.published} lessons={lessons}/>
        </aside>
        <div className={!this.state.showCreateCourse ? 'hide' : ''}>
        <div className="course-page-body">
         <section className="course-body pl-6 pr-6" >
          <h6 className="mb-4">{this.state.formStatus == 'edit' ? 'Edit Lesson' : 'Create New Lesson'}</h6>
               <Form onSubmit = {this.createLesson}  id={this.state.lesson_id} onChange={this.checkTheFields}>
                <FormGroup color={errors.lesson_name ? "danger" : ""}>
              <Label for="lesson_name">Lesson Name</Label>
              <Input type="text" name="lesson_name" value={this.state.lesson_name} onChange={(e) => this.handleChange(e, ['required'])} placeholder="Enter a name for the lesson" />
              {errors.lesson_name ? <FormFeedback>{errors.lesson_name}</FormFeedback> : "" }
            </FormGroup>

            <FormGroup>
              <Label for="exampleEmail">XP: <b>100</b></Label>
            </FormGroup>
            <FormGroup color={errors.lesson_content ? "danger" : ""}>
              <Label for="lesson_content">Lesson Description</Label>
              <Input type="text" name="lesson_content" value={this.state.lesson_content} onChange={(e) => this.handleChange(e, ['required'])} placeholder="Enter a description for the lesson" />
              {errors.lesson_content ? <FormFeedback>{errors.lesson_content}</FormFeedback> : "" }
            </FormGroup>
            <FormGroup>
            <Label>Preview Image</Label>
              <div className="mb-2">
                <Button outline className="btn-short" color="primary" size="sm" onClick={this.toggle}>Select stock image</Button>{' '}
                <span>
                  <Label className={this.state.loading ? "btn btn-outline-primary btn-sm mb-0 disabled" : "btn btn-outline-primary btn-sm mb-0"}>
                  <Input type="file" disabled={this.state.loading} onChange={this.uploadPreview}/>Upload</Label>
                </span>
              </div>
            </FormGroup>
            <FormGroup>
              <FormGroup>
               {!this.state.loading ?
                <div className="thumbnail-container">
                <div className={this.state.preview_image ? 'thumbnail' : 'hide'} style={{backgroundImage: 'url(' + this.state.preview_image + ')'}}>
                  <a onClick={this.cancelPreviewImage} className="thumbnail-remove"></a>
                </div>
              </div>
              :
              <div className={this.state.loading ? '' : 'hide'}>
                <span sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
                  <img src="/assets/icon-loading.svg"/>
                </span>
              </div>}

              </FormGroup>
            </FormGroup>
            <FormGroup>
            <div className="mt-3 float-right">

                <Button size="lg" color={this.state.formStatus == 'edit' ? 'primary' : 'ternary'} disabled={this.state.buttonDisable || this.state.loading ? true : false} type="submit">{this.state.formStatus=='edit' ? 'Save' : 'Create'}</Button>{' '}
                <Button size="sm" className="btn-cancel" color="cancel" onClick={this.resetForm}>Cancel</Button>
              </div>
            </FormGroup>
            </Form>
            </section>
          </div>
        </div>
      </div>

    </LessonPage>
    );
  }
}

Lesson.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Lesson.propTypes = {
 auth: PropTypes.object,
 viewcourses:PropTypes.object,
 actions: PropTypes.object.isRequired,
 lessons:PropTypes.array
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    viewcourses: state.courseView,
    lessons:state.lessons,
    auth:state.auth
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lesson);
