import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CoursePage from './CoursePage';
import { Button, Row, Input, FormGroup, Label, Form, Container, Modal, ModalHeader, ModalFooter, ModalBody,FormFeedback} from 'reactstrap';
import ClassList from './ClassList';
import * as actions from '../common/actions/index';
//import {Link} from 'react-router';
import cookie from 'react-cookie';
let _ = require('lodash');
import $ from 'jquery';
import UnsplashImages from '../common/components/ImagesFromUnspash';
import {validate} from '../../validators';

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
       modal: false,
       showCreateCourse:false,
       published:false,
       editClassObj:{},
       availableRibbons:[],
       modal1:false,
       modelopen:false,
       loading:false,
       classFormState:'create',
       publishedStatus:false,
       'errors': {},
       'buttonDisable':true
    };

    this.createClass=this.createClass.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.showCreateClassForm=this.showCreateClassForm.bind(this);
    this.publishClass=this.publishClass.bind(this);
    this.editClassPage=this.editClassPage.bind(this);
    this.lessonsPage=this.lessonsPage.bind(this);
    this.changeUploadedRibbon=this.changeUploadedRibbon.bind(this);
    this.ribbonId=this.ribbonId.bind(this);
    this.toggle=this.toggle.bind(this);
    this.toggle1=this.toggle1.bind(this);
    this.changeRibbonId=this.changeRibbonId.bind(this);
    this.uploadPreview=this.uploadPreview.bind(this);
    this.previewImageUnspalsh=this.previewImageUnspalsh.bind(this);
    this.cancelPreviewImage=this.cancelPreviewImage.bind(this);
    this.changeUploadedRibbonBtn=this.changeUploadedRibbonBtn.bind(this);
    this.resetForm=this.resetForm.bind(this);
    this.checkTheFields=this.checkTheFields.bind(this);
  }
 componentDidMount() {
    const courseId=this.props.params.id;
    //const courseObject=_.find(this.props.courses, { 'id': courseId });
    //this.setState({'courseObject':courseObject});
    //const viewcourses=_.find(this.props.course)
    //ribbon_url=this.props.viewcourses.ribbons[0].ribbon_url
    this.props.actions.viewCourse(courseId);
    this.props.actions.getAllClasses(courseId);
    this.changeUploadedRibbon();
  }

 

  handleChange(e, validators = []) {
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);  
    this.setState({errors, [e.target.name]: e.target.value});
    if(this.state.class_name && this.state.class_content &&  this.state.preview_image && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }

  checkTheFields(){
    if(this.state.class_name && this.state.class_content  && this.state.preview_image && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }
  createClass(event){
    event.preventDefault();
    const classObj={};
    classObj.name=this.state.class_name;
    classObj.description=this.state.class_content;
    classObj.course_ribbon_id=this.state.ribbon_id;
    classObj.hero_image=this.state.preview_image;
    classObj.video_url=this.state.class_video_url;
    classObj.points=100;
    classObj.status='drafted';
    classObj.course_id=this.props.params.id;
    classObj.created_user=this.props.auth.user_id || cookie.load('org_obj').user_id;
    classObj.modified_user=this.props.auth.user_id || cookie.load('org_obj').user_id;
    if(event.target.id){
     classObj.id=event.target.id;
     classObj.status=this.state.status;
     this.props.actions.updateClass(classObj);
    }else{
    this.props.actions.createClass(classObj);
    }
  }
  editClassPage(class_id,status){
    const classObject=_.find(this.props.classes.draftedClasses, { 'id': parseInt(class_id) });
    const classObject1=_.find(this.props.classes.publishedClasses, { 'id': parseInt(class_id) });
    const editClassObj=classObject||classObject1;
    const ribbons_array=this.props.viewcourses.ribbons;
    const ribbon_obj=_.find(ribbons_array,{'id':editClassObj.course_ribbon_id});

    this.setState({'class_id':editClassObj.id,'class_name':editClassObj.name,'class_content':editClassObj.description,'preview_image':editClassObj.hero_image,'class_video_url':editClassObj.video_url,'course_ribbon':ribbon_obj.ribbon_url,'status':status, 'showCreateCourse':true,'classFormState':'edit'});
  }
  publishClass (class_id) {
    $.post('/api/class/publish/'+class_id+'/'+this.props.params.id).done((response) =>{
       this.setState({'published':true});
       this.props.actions.updateStoreWithNewClasses(response.result);
    });
  }

  resetForm(event){
    event.preventDefault();
    if(this.state.classFormState == 'create'){
      this.setState({'class_id':'','class_name':'','class_content':'','preview_image':'','class_video_url':'','status':''});
    }else if(this.state.classFormState == 'edit'){
      this.setState({ showCreateCourse: false});
    }
  }

  lessonsPage(class_id){
    const path='/app/course/'+this.props.params.id+'/class/'+class_id;
    this.context.router.push(path);
  }

  showCreateClassForm() {
    this.setState({'classFormState':'create'})
    if(this.state.showCreateCourse){
      this.setState({'class_id':'','class_name':'','class_content':'','preview_image':'','class_video_url':'','status':''});
    }else{
      this.setState({ showCreateCourse: true});
    }
  }
  changeUploadedRibbonBtn(event){
     event.preventDefault();
     this.setState({'modelopen':true});
     this.changeUploadedRibbon();
  }
  changeUploadedRibbon(){
    $.post('/api/class/available/ribbons/'+this.props.params.id).done((response) =>{
      this.setState({'availableRibbons':response.result});
      if(this.state.modelopen){
         this.toggle();
      }
      const course_ribbon=response.result[0];
      if(course_ribbon){
      this.setState({'course_ribbon':course_ribbon.ribbon_url,'ribbon_id':course_ribbon.id});
      }
    });
  }

  ribbonId(event){
    event.preventDefault();
    this.setState({'ribbon_css_id':event.target.id,'course_css_ribbon':event.target.getAttribute('data-ribbonid')});
  }

  changeRibbonId(event){
    event.preventDefault();
    this.setState({'course_ribbon':this.state.course_css_ribbon,'ribbon_id':this.state.ribbon_css_id});
    this.toggle();
  }

  componentWillReceiveProps(props){
    if(props.classes){
        this.setState({'class_id':'','class_name':'','class_content':'','preview_image':'','class_video_url':'','course_ribbon':''});
        this.changeUploadedRibbon();
    }
  }
  cancelPreviewImage(event){
    event.preventDefault();
    this.setState({'preview_image':''});
    this.setState({ 'buttonDisable': true });

  }

  uploadPreview(event) {
    event.preventDefault();
    const file = event.target.files[0];
    if (file.type.indexOf('image/') === 0) {
        // This is a post request to server endpoint with image as `image`
        this.setState({ 'loading': true });
        const formData = new FormData();
        formData.append('image', file);
        fetch('/api/fileupload', {
            method: 'POST',
            body: formData,
            headers: {
                'Access-Control-Allow-Origin': ''
            },
        }).then((response) => {
            if (response.status === 200) {
                // Assuming server responds with
                // `{ "url": "http://example-cdn.com/image.jpg"}`
                return response.json().then(data => {
                    if (data) {
                        this.setState({ 'preview_image': data.files[0].url });
                        this.setState({ 'loading': false });
                        //toastr.success("Image Uploaded Succesfully", "Success");
                        if (this.state.class_name && this.state.class_content  && this.state.preview_image) {
                            this.setState({ 'buttonDisable': false });
                        }
                    }
                });
            }
        });
    }
}


  toggle() {
    if(this.state.modal){
      this.setState({'ribbon_css_id':''});
    }
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggle1(e) {
    if(e){
    e.preventDefault();
    }
    this.setState({
      modal1: !this.state.modal1,
    });
  }

  previewImageUnspalsh(url) {
     this.setState({ 'preview_image': url });
     if (this.state.class_name && this.state.class_content &&  url) {
         this.setState({ 'buttonDisable': false });
     }
     this.toggle1();
 }


  render() {
    const imagecheck=<img className="material-thumbnail-check" src="/assets/icon-completed.svg"/>;
    const {errors} = this.state;
    return (
    <CoursePage>
    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>Select Available Ribbon</ModalHeader>
        <ModalBody>
          <div>
          <Container>
            <Row>
            {this.state.availableRibbons.length > 0 ?

            this.state.availableRibbons.map(url => <div className='m-2'>
            <div className={url.id == this.state.ribbon_css_id ? "material-thumbnail ribbon is-selected" : "material-thumbnail ribbon"} style={{backgroundImage: 'url('+url.ribbon_url+')'}} id={url.id} data-ribbonid={url.ribbon_url} onClick={this.ribbonId}>
              {url.id == this.state.ribbon_css_id ? imagecheck : ""}
              
            </div>
            </div>) : 'Ribbons are not available'}

            </Row>
        </Container>
            </div>
        </ModalBody>
        <ModalFooter>
          <Button size="lg" color="primary"  onClick={this.changeRibbonId}>Select</Button>{' '}
          <Button size="lg" className="btn-cancel" color="cancel" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.modal1} toggle={this.toggle1} className={this.props.className}>
      <ModalHeader toggle={this.toggle1}>Select Image</ModalHeader>
      <UnsplashImages preview_unsplash={this.previewImageUnspalsh} modelClose={this.toggle1}/>
    </Modal>

      <div className="course-page">
        <aside className="course course-main">
          <div className="course-title">
            <h4>{this.props.viewcourses.name}</h4>
            <div className="course-title-description">{this.props.viewcourses.description}</div>
          </div>
          <div className="course-action"> <Button block size="lg" color="primary" onClick={this.showCreateClassForm}> New Class</Button></div>
         { <ClassList lessonPage={this.lessonsPage} editClassPage={this.editClassPage} courseObj={this.props.viewcourses} classes={this.props.classes} publish={this.publishClass} published={this.state.published}/>}
         </aside>
        <div className={!this.state.showCreateCourse ? 'hide' : ''}>
        <div className="course-page-body">
          <section className="course-body pl-6 pr-6" >
            <h6 className="mb-4">{this.state.classFormState == 'edit' ? 'Edit Class' : 'Create New Class'}</h6>
            <Form onSubmit = {this.createClass}  id={this.state.class_id} onChange={this.checkTheFields}>
             <FormGroup color={errors.class_name ? "danger" : ""}>
              <Label for="class_name">Class Name</Label>
              <Input type="text" name="class_name" value={this.state.class_name} onChange={(e) => this.handleChange(e, ['required'])} placeholder="Enter a name for the class" />
              {errors.class_name ? <FormFeedback>{errors.class_name}</FormFeedback> : "" }
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">XP: <b>100</b></Label>
            </FormGroup>
            <FormGroup color={errors.class_content ? "danger" : ""}>
              <Label for="class_content">Class Description</Label>
              <Input type="text" name="class_content" value={this.state.class_content} onChange={(e) => this.handleChange(e, ['required'])} placeholder="Enter a description for the class" />
              {errors.class_content ? <FormFeedback>{errors.class_content}</FormFeedback> : "" }
            </FormGroup>
            <FormGroup>
              <Label for="class_video_url">Video URL</Label>
              <Input type="text" name="class_video_url" autocomplete="nope"  value={this.state.class_video_url} onChange={(e) => this.handleChange(e, ['required'])} placeholder="" />
            </FormGroup>
            <FormGroup>
              <Label for="class_ribbon_url">Class Ribbon</Label>
              <FormGroup>
              <div className="r-1-wrapper">
                <div style={{backgroundImage: 'url(' + this.state.course_ribbon + ')'}}className={this.state.course_ribbon ? 'r-1-image' : 'hide'}>
                </div>{'  '}
                <div className="mr-1"></div>
                {this.state.status == 'published'  ? '' :  
                <Button outline className="btn-short" color="primary" size="sm" onClick={this.changeUploadedRibbonBtn}>Change</Button>}
              </div>

              </FormGroup>
            </FormGroup>
            <FormGroup>
            <Label>Preview Image</Label>
              <div className="mb-2">
                <Button outline className="btn-short" color="primary" size="sm" onClick={this.toggle1}>Select stock image</Button>{' '}
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
                : <div className={this.state.loading ? '' : 'hide'}>
                  <span sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
                    <img src="/assets/icon-loading.svg"/>
                  </span>
                </div>}
              </FormGroup>
            </FormGroup>
            <FormGroup>
            <div className="mt-3 float-right">
                <Button size="lg" color={this.state.classFormState == 'edit' ? 'primary' : 'ternary'} disabled={this.state.buttonDisable || this.state.loading ? true : false} type="submit" data-ribbonid={this.state.ribbon_id}>{this.state.classFormState == 'edit' ? 'Save' : 'Save as draft'}</Button>{' '}
                <Button size="sm" className="btn-cancel" color="cancel" onClick={this.resetForm}>Cancel</Button>
            </div>
            </FormGroup>
            </Form>
          </section>
          </div>
        </div>
      </div>
    </CoursePage>
    );
  }
}

Course.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Course.propTypes = {
 auth: PropTypes.object,
 viewcourses:PropTypes.object,
 actions: PropTypes.object.isRequired,
 classes:PropTypes.array
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    viewcourses:state.courseView,
    classes:state.classes,
    auth:state.auth
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Course);
