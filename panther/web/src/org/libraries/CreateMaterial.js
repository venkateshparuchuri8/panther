import React,{Component,PropTypes} from 'react';
import {Input , Form , Label , FormGroup ,Modal ,ModalHeader ,ModalFooter,FormFeedback} from 'reactstrap';
import * as actions from '../common/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cookie from 'react-cookie';
import SelectImage from './SelectImage';
import toastr from 'toastr';
//import $ from 'jquery';
import RWBEditor from './Editor';
import {convertToHTML} from 'draft-convert';
import Button from 'react-bootstrap-button-loader';
import AddQuestion from './AddQuestion';
import {validate} from '../../validators';
import BreadCrumb from './BreadCrumb';


class CreateMaterial extends Component{

  constructor (props) {
    super(props);
    this.state ={
      value: this.props.from == 'tasks' ? '' : 'Video',
      modal: false,
      questions:[],
      loading:false,
      imageloading:false,
      materialshow : this.props.materialshow,
      'errors': {},
      'buttonDisable':true,
      'buttonloading':false

   };
    this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
    this.createMaterial = this.createMaterial.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetClick = this.resetClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getmetadata = this.getmetadata.bind(this);
    this.selected_image = this.selected_image.bind(this);
    this.image_submit = this.image_submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.contentChange= this.contentChange.bind(this);
    this.newquestion = this.newquestion.bind(this);
    this.createMaterialInTask = this.createMaterialInTask.bind(this);
    this.cancelPreviewImage= this.cancelPreviewImage.bind(this);
    this.checkTheFields=this.checkTheFields.bind(this);
    this.buttondisable = this.buttondisable.bind(this);

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.classes != undefined){
      //cookie.save('org_obj', nextProps.auth, { path: '/' });
    }
  }
  cancel(e, url){
    e.preventDefault();
    this.setState({'hero_image':''});
    if (this.state.url && this.state.title && this.state.estimated_time && url) {
         this.setState({ 'buttonDisable': false });
    }else{
      this.setState({buttonDisable:true});
    }
    this.toggle(e);
  }

  onRadioBtnChange(e) {
    this.setState({
      value: e.target.value,
      title:'',
      url:'',
      estimated_time:'',
      author:'',
      content:'',
      hero_image:'',
      reflection:'',
      materialshow: true,
      question:'',
      questions:[],
      'errors':{}
    });
    this.checkTheFields(e.target.value);
    if(this.props.materialaction) this.props.materialaction(this.state.materialshow);
   }
  onChange(e, validators = []){
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
    this.setState({errors, [e.target.name]: e.target.value});
    this.checkTheFields(this.state.value);
    if((errors && Object.keys(this.state.errors).length == 0) && e.target.name == 'question') {
      this.props.reflectionCallback(e.target.value);
    }
  }


   checkTheFields(val){
    if(val == 'Video' || val == 'PDF'){
        if(val && this.state.url && this.state.title && this.state.estimated_time  && this.state.hero_image && (Object.keys(this.state.errors).length) == 0){
          this.setState({'buttonDisable':false});
        }else{
          this.setState({'buttonDisable':true});
        }

      }else if(val == 'Article' || val == 'Podcast'){
        if(val && this.state.url && this.state.title && this.state.estimated_time && this.state.author && this.state.hero_image && (Object.keys(this.state.errors).length) == 0){
          this.setState({'buttonDisable':false});
        }else{
          this.setState({'buttonDisable':true});
        }

      }else if(val == 'Editor'){
        if(val && this.state.title && this.state.content && this.state.hero_image && this.state.estimated_time && (Object.keys(this.state.errors).length) == 0){
          this.setState({'buttonDisable' : false});
        }else{
          this.setState({'buttonDisable' : true});
        }
      }else if(val == 'Link'){
        if(val && this.state.url && this.state.title && this.state.hero_image && (Object.keys(this.state.errors).length) == 0){
          this.setState({'buttonDisable':false});
        }else{
          this.setState({'buttonDisable':true});
        }
      }else if(val == 'Reflection'){
        if(val && this.state.question && (Object.keys(this.state.errors).length) == 0){
          this.setState({'buttonDisable':false});
        }else{
          this.setState({'buttonDisable':true});
        }
      } else if(val == 'Quiz'){
        console.log(this.state.questions);
        if(val && this.state.questions.length!= 0 && (Object.keys(this.state.errors).length) == 0 ){
          this.setState({'buttonDisable':false});
        }else{
          this.setState({'buttonDisable':true});
        }
      }
  }
  fileUpload(e) {
    e.preventDefault();
    const file = e.target.files[0];
    this.setState({'imageloading':true});
    if (file.type.indexOf('image/') === 0) {
      // This is a post request to server endpoint with image as `image`
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
              this.setState({'hero_image' :data.files[0].url});
              this.setState({'imageloading':false});
              toastr.success("Image Uploaded Succesfully", "Success");
              this.checkTheFields(this.state.value);
            }
          });
        }
      });
    }

  }
  formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
      h > 9 ? h : '0' + h,
      m > 9 ? m : '0' + m,
      s > 9 ? s : '0' + s,
    ].join(':');
  }

  createMaterial(e){
    e.preventDefault();
    this.setState({
      buttonloading:true
    });
   const obj={};
    obj.title = this.state.title;
    obj.type= this.state.value;
    obj.modified_user = cookie.load('org_obj').user_id;
    obj.created_user = cookie.load('org_obj').user_id;
    obj.author = this.state.author;
    obj.estimated_time = this.state.estimated_time;
    obj.url = this.state.url;
    obj.organization_id = cookie.load('org_obj').org_id;
    obj.hero_image = this.state.hero_image;
    obj.content = this.state.content;
    actions.createMaterial(obj).done((response) => {
      if(response.result) {
        toastr.success("Material Created Succesfully", "Success");
        this.setState({
          buttonloading:false
        });
        this.context.router.push('/app/libraries');
      }
    });

  }

  createMaterialInTask(event){
    event.preventDefault();
    //e.preventDefault();
    if(this.state.value == 'Reflection' && parseInt(event.target.getAttribute('data-reflection_count')) > 0){
        toastr.warning("You can't create more than one reflection for a lesson", "Warning");
    }else if(this.state.value == 'Quiz' && parseInt(event.target.getAttribute('data-quiz_count')) > 0){
        toastr.warning("You can't create more than one quiz for a lesson", "Warning");
    }else{
      const obj={};
    obj.title = this.state.title;
    obj.type= this.state.value;
    obj.modified_user = cookie.load('org_obj').user_id;
    obj.created_user = cookie.load('org_obj').user_id;
    obj.author = this.state.author;
    obj.estimated_time = this.state.estimated_time;
    obj.url = this.state.url;
    obj.organization_id = cookie.load('org_obj').org_id;
    obj.hero_image = this.state.hero_image;
    obj.content = this.state.content;
    if(obj.type == 'Reflection'){
        obj.question = this.state.question;
    }
    this.props.addMaterialsToTask(obj);
    this.setState({
      value: '',
      title:'',
      url:'',
      estimated_time:'',
      author:'',
      content:'',
      hero_image:'',
      reflection:'',
      materialshow: false

    });
    }
  }
  resetClick(e){
    e.preventDefault();
    this.setState({
      value: '',
      title:'',
      url:'',
      estimated_time:'',
      author:'',
      content:'',
      hero_image:'',
      'errors':{},
      buttonDisable:true

    });
    if(this.props.from == 'tasks'){
      this.props.resetClick();
      //this.props.questions
    }
  }
toggle(e) {
  e.preventDefault();
    this.setState({
      modal: !this.state.modal
    });
  }
  image_submit(e){
    if(!this.state.hero_image){
      toastr.warning("Please Select an Image" , "Warning");
    }else{
      this.checkTheFields(this.state.value);
      this.toggle(e);
    }
 }

 selected_image(id){
    this.setState({'hero_image':id});
  }
  getmetadata(e){
    e.preventDefault();
    if(this.state.url && this.state.value == 'Video'){
      this.setState({loading:true});
      fetch('/api/youtubeapi',{
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body:JSON.stringify({
          url:this.state.url
        })
      }).then((response)=>{
        if(response.status === 200){
          return response.json().then(data => {
            console.log(data);
            if(data.status =='success' && data.result){
              this.setState({
                title : data.result.title,
                hero_image : data.result.image_url,
                estimated_time : data.result.estimated_time ? this.formatTime(data.result.estimated_time) : '00:00:00',
                'errors':{}
                });
              this.checkTheFields(this.state.value);

            }
            else{
              toastr.warning(data.result , "Warning");
            }
            this.setState({loading:false});
          });

        }
      });

    }
    else if(this.state.url && (this.state.value != "PDF" && this.state.value != "Editor")){
      this.setState({loading:true});
      fetch('/api/getmetadata',{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: this.state.url
          })
      }).then((response)=>{
        if (response.status === 200) {
          // Assuming server responds with
          // `{ "url": "http://example-cdn.com/image.jpg"}`
          return response.json().then(data => {
            if (data.status == 'success' && data.result) {
              this.setState({
                  title:data.result.title,
                  hero_image : data.result.url,
                  author : data.result.author,
                  estimated_time: '00:00:00',
                  'errors':{}
                });
              this.checkTheFields(this.state.value);
            }
            else{
              toastr.warning(data.result , "Warning");
            }
           this.setState({loading:false});
          });
       }

      });
    }

  }
  contentChange(val){

    this.setState({content:convertToHTML(val.editorState.getCurrentContent())});
  }

  newquestion(questions){
    this.setState({questions:questions});
    this.props.questionslistCallback(this.state.questions);

  }
  cancelPreviewImage(e){
    e.preventDefault();
    this.setState({
      'hero_image':'',
      'buttonDisable': true
    });

  }
  buttondisable(val){
    console.log(val);
    this.setState({'buttonDisable':val});

  }

  render(){
    let {errors}  = this.state;

    return(
      <div>
       {this.props.from == 'tasks' ? '':
       <BreadCrumb />}

          <Form onChange={this.checkTheFields}>
            <FormGroup check>
              <FormGroup className="mb-0">
                <Label>Material Type</Label>
              </FormGroup>
              <FormGroup className="border-wrapper">
                <Label check>
                  <Input type="radio"
                   value="Video"
                   name = "video"
                   onChange={this.onRadioBtnChange}
                   checked={this.state.value === 'Video'}/>{' '}
                    <span>Video</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Article"
                  name="article"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Article'}/>{' '}
                    <span>Article</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="PDF"
                  name="pdf"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'PDF'}/>{' '}
                    <span>PDF</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Podcast"
                  name="podcast"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Podcast'}/>{' '}
                    <span>Podcast</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Editor"
                  name="editor"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Editor'}/>{' '}
                    <span>Editor</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Link"
                  name="link"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Link'}/>{' '}
                  <span>Link</span>
                </Label>
                {this.props.from == 'library'? '' :
                <FormGroup className="mt-1 mb-0">
                  <Label check>
                    <Input type="radio"
                      value="Quiz"
                      name="quiz"
                      onChange={this.onRadioBtnChange}
                      checked={this.state.value === 'Quiz'}/>{' '}
                    <span>Quiz</span>
                  </Label>
                  <Label check>
                    <Input type="radio"
                    value="Reflection"
                    name="reflection"
                    onChange={this.onRadioBtnChange}
                    checked={this.state.value === 'Reflection'}/>{' '}
                    <span>Reflection</span>
                  </Label>
                </FormGroup>}
                </FormGroup>
                <div className={this.state.materialshow ? 'show' : 'hide'}>

                  <FormGroup color={errors.url ? "danger" : ""} className={(this.state.value == 'Editor')|| (this.state.value == 'Reflection') || (this.state.value == 'Quiz') ? 'hide' : 'show'}>
                    <Label>URL</Label>
                      <Input type="url" name="url" id="url" value={this.state.url} placeholder="Enter the URL" onBlur={this.getmetadata} onChange={(e) => this.onChange(e, ['required'])} />
                  {errors.url ? <FormFeedback>{errors.url}</FormFeedback> : "" }
                  </FormGroup>
                  <div id="loading" className={this.state.loading ? 'show': 'hide'}><img src="/assets/icon-loading.svg" /></div>

                  <FormGroup color={errors.title ? "danger" : ""} className={(this.state.value == 'Reflection') || (this.state.value == 'Quiz')? 'hide':'show'}>
                  <Label>Title</Label>
                      <Input type="text" name="title" id="title" placeholder="Title" value={this.state.title} onChange={(e) => this.onChange(e, ['required'])}/>
                      {errors.title  ? <FormFeedback>{errors.title}</FormFeedback> : "" }
                  </FormGroup>
                  <FormGroup color={errors.estimated_time ? "danger" : ""} className={(this.state.value == 'Video') ? 'show' : 'hide'}>
                   <Label>Duration</Label>
                    <Input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" id="24h" name="estimated_time" placeholder="hh:mm:ss" value={this.state.estimated_time} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.estimated_time ? <FormFeedback>{errors.estimated_time}</FormFeedback> : "" }
                  </FormGroup>
                  <FormGroup color={errors.author ? "danger" : ""} className={(this.state.value == 'Article')||(this.state.value == 'Podcast') ? 'show' : 'hide'}>
                    <Label>Author Name</Label>
                      <Input type="text" name="author" id="author" placeholder="Author Name" value={this.state.author} onChange={(e) => this.onChange(e, ['required'])}/>
                      {errors.author ? <FormFeedback>{errors.author}</FormFeedback> : "" }
                  </FormGroup>

                   <FormGroup color={errors.content ? "danger" : ""} className={(this.state.value == 'Editor')? 'show' : 'hide'}>
                    <Label>Content</Label>
                    <RWBEditor value={this.state.content} name='content' change={this.contentChange}/>
                    {errors.content ? <FormFeedback>{errors.content}</FormFeedback> : "" }
                  </FormGroup>
                  <FormGroup color={errors.estimated_time ? "danger" : ""} className={(this.state.value == 'Video')||(this.state.value == 'Podcast')||(this.state.value == 'Link')|| (this.state.value == 'Reflection') || (this.state.value == 'Quiz')? 'hide' : 'show'}>
                    <Label>Est Reading Time</Label>
                      <Input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" id="24h" name="estimated_time" placeholder="hh:mm:ss" value={this.state.estimated_time} onChange={(e) => this.onChange(e, ['required'])}/>
                       {errors.estimated_time ? <FormFeedback>{errors.estimated_time}</FormFeedback> : "" }
                  </FormGroup>
                  <FormGroup color={errors.estimated_time ? "danger" : ""} className={this.state.value == 'Podcast' ? 'show' : 'hide'}>
                    <Label>Est Listening Time</Label>
                      <Input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" id="24h" name="estimated_time" placeholder="hh:mm:ss" value={this.state.estimated_time} onChange={(e) => this.onChange(e, ['required'])}/>
                       {errors.estimated_time ? <FormFeedback>{errors.estimated_time}</FormFeedback> : "" }
                  </FormGroup>
                  {this.props.from == 'library'? '' :
                  <FormGroup>
                  {this.state.value == 'Quiz' ? <AddQuestion addquestion={this.newquestion} buttondisable={this.buttondisable} questionfrom="create"/> : ''}


                  <FormGroup color={errors.question ? "danger" : ""} className={this.state.value == 'Reflection' ? 'show' : 'hide'}>
                    <Label>Question</Label>
                    <Input type="text" placeholder="Describe the reflection"  name="question" value={this.state.question} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.question ? <FormFeedback>{errors.question}</FormFeedback> : "" }
                  </FormGroup>
                  </FormGroup>}



                <FormGroup  className={(this.state.value == 'Reflection') || (this.state.value == 'Quiz') ? 'hide' : 'show'}>
                  <Label>Preview Image</Label><br/>
                  <Button className="btn-outline-primary btn-short btn-sm"  onClick={this.toggle}>Select Stock Image</Button>{' '}
                  <Label className="btn btn-outline-primary btn-sm mb-0">
                    <Input type="file" onChange={this.fileUpload}/>
                    Upload
                  </Label>
                  <Modal isOpen={this.state.modal} toggle={this.toggle}>
                   <ModalHeader toggle={this.toggle}>Select Image</ModalHeader>
                    <SelectImage image_selected={this.selected_image}/>
                    <ModalFooter>
                    <Button className="btn-primary btn-lg" onClick={this.image_submit}>Done</Button>
                    <Button size="lg" className="btn-cancel" color="cancel" onClick={this.cancel}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </FormGroup>
                <FormGroup>
                {!this.state.imageloading ?
                <div className="thumbnail-container">
                <div className={this.state.hero_image ? 'thumbnail' : 'hide'} style={{backgroundImage: 'url(' + this.state.hero_image + ')'}}>
                  <a onClick={this.cancelPreviewImage} className="thumbnail-remove"></a>
                </div>
                </div>
                  :
                <div className={this.state.imageloading ? '' : 'hide'}>
                  <div sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
                    <img src="/assets/icon-loading.svg"/>
                  </div>
                </div>}
                </FormGroup>
                <FormGroup style={{float:'right'}}>
                {this.props.from == 'tasks' ?
                <Button className="btn-primary btn-lg" loading={this.state.buttonloading} data-quiz_count={this.props.quizCount} data-reflection_count={this.props.reflectionCount}
                 onClick={this.createMaterialInTask} disabled ={this.state.buttonDisable || this.state.buttonloading ? true : false}>Create</Button>
                :
                  <Button className="btn-primary btn-lg" loading={this.state.buttonloading} onClick={this.createMaterial} disabled={this.state.buttonDisable || this.state.buttonloading ? true : false}>Create</Button>
                }
                  {'   '}<Button size="lg" className="btn-cancel" color="cancel" onClick={this.resetClick}>Cancel</Button>
                </FormGroup>

                </div>
               </FormGroup>

            </Form>
      </div>


    );
  }
}
CreateMaterial.contextTypes = {
  router: React.PropTypes.object.isRequired
};

CreateMaterial.propTypes = {
 actions: PropTypes.object.isRequired,
 materials:PropTypes.object
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth:state.auth
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateMaterial);
