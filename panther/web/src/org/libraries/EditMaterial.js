import React,{Component,PropTypes} from 'react';
import Page from '../common/components/Page';
import { Row, Col, Input , Form , Label , FormGroup ,Modal ,ModalHeader ,ModalFooter, FormFeedback} from 'reactstrap';
import BreadCrumb from './BreadCrumb';
import * as actions from '../common/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import cookie from 'react-cookie';
//import $ from 'jquery';
import SelectImage from './SelectImage';
import toastr from 'toastr';
import RWBEditor from './Editor';
import {convertToHTML} from 'draft-convert';
import Button from 'react-bootstrap-button-loader';
import {validate} from '../../validators';



class EditMaterial extends Component{
  constructor(props){
    super(props);
    this.state={
      value:'',
      materialobj:'',
      modal: false,
      loading:false,
      imageloading:false,
      'errors': {},
      'buttonDisable':true,
      'buttonloading':false
    };
    this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
    this.onChange =this.onChange.bind(this);
    this.resetClick =this.resetClick.bind(this);
    this.editMaterialClick = this.editMaterialClick.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.getmetadata = this.getmetadata.bind(this);
    this.selected_image = this.selected_image.bind(this);
    this.toggle = this.toggle.bind(this);
    this.image_submit = this.image_submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.contentChange= this.contentChange.bind(this);
    this.cancelPreviewImage = this.cancelPreviewImage.bind(this);
    this.checkTheFields = this.checkTheFields.bind(this);

   }

  componentWillMount(){
    const materialId = this.props.params.id;
    const materials = this.props.materials;
    if(materialId){
    const materialobj= _.find(materials, function(obj){
      return obj.id == materialId;
    });
    if(materialobj){
      this.setState({
      materialobj: materialobj,
      value:materialobj.type,
      title:materialobj.title,
      url:materialobj.url,
      estimated_time:materialobj.estimated_time,
      author:materialobj.author,
      hero_image:materialobj.hero_image,
      content:materialobj.content
    });
    }else{
      this.props.actions.getMaterial(this.props.params.id);
    }

   }

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.materials.length){
    this.setState({
      materialobj:nextProps.materials[0],
      value:nextProps.materials[0].type,
      title:nextProps.materials[0].title,
      url:nextProps.materials[0].url,
      estimated_time:nextProps.materials[0].estimated_time,
      author:nextProps.materials[0].author,
      hero_image:nextProps.materials[0].hero_image,
      content:nextProps.materials[0].content
      });
    }
  }
/*   checkTheFields(){
    if(this.state.url && this.state.title && this.state.estimated_time && this.state.hero_image && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }*/

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
      }
  }

  contentChange(val){
    this.setState({content:convertToHTML(val.editorState.getCurrentContent())});
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
      'errors':{}

    });
    this.checkTheFields(e.target.value);
  }
  onChange(e, validators = []){
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
    this.setState({errors, [e.target.name]: e.target.value});
    /*if(this.state.value && this.state.url && this.state.title && this.state.estimated_time && this.state.hero_image && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }*/
    this.checkTheFields(this.state.value);
  }
  fileUpload(e) {
    e.preventDefault();
    this.setState({'imageloading':true});
    const file = e.target.files[0];
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
              toastr.success("Image Uploaded Succesfully","Success");
               this.checkTheFields(this.state.value);
              /*if (this.state.url && this.state.title && this.state.estimated_time && this.state.hero_image) {
                       this.setState({ 'buttonDisable': false });
               }*/

            }
          });
        }
      });
    }

  }
  resetClick(){
    this.context.router.push('/app/libraries');
  }
  formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
      h,
      m > 9 ? m : '0' + m,
      s > 9 ? s : '0' + s,
    ].filter(s => s).join(':');
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
            if(data.status =='success' && data.result){
              this.setState({
                title:data.result.title,
                hero_image:data.result.image_url,
                estimated_time : data.result.estimated_time ? this.formatTime(data.result.estimated_time): '00:00:00',
                'errors':{},
                //buttonDisable:false
              });
               this.checkTheFields(this.state.value);



            }
            this.setState({loading:false});
          });

        }
      });

    }
    else if(this.state.url){
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
            if (data && data.result) {
              this.setState({
                  title:data.result.title,
                  hero_image : data.result.url,
                  author : data.result.author,
                  'errors':{},
                  //buttonDisable:false
                });
               this.checkTheFields(this.state.value);

            }
           this.setState({loading:false});
          });
       }

      });
    }
}
selected_image(id){
   this.setState({hero_image: id});
}
image_submit(e){
    if(!this.state.hero_image){
      toastr.warning("Please Select an Image","Warning");
    }else{
     // this.setState({ 'buttonDisable': false });
     this.checkTheFields(this.state.value);
      this.toggle(e);
    }
}
cancel(e,url){
  e.preventDefault();
  this.setState({'hero_image':''});
  if (this.state.url && this.state.title && this.state.estimated_time && url) {
    this.setState({ 'buttonDisable': false });
  }else{
      this.setState({buttonDisable:true});
    }
  this.toggle(e);
}
cancelPreviewImage(e){
    e.preventDefault();
    this.setState({'hero_image':'', 'buttonDisable': true});
  }
editMaterialClick(e){
    e.preventDefault();
    this.setState({
      buttonDisable:true
    });
    const obj={};
    obj.title = this.state.title;
    obj.type= this.state.value;
    obj.modified_user = cookie.load('org_obj').user_id;
    obj.author = this.state.author;
    obj.estimated_time = this.state.estimated_time;
    obj.url = this.state.url;
    obj.hero_image = this.state.hero_image;
    obj.id = this.props.params.id;
    obj.content = this.state.content;
    actions.updateMaterial(obj).done((response) => {
      if(response.result) {
        toastr.success("Material Updated Succesfully", "Success");
        this.setState({
          buttonDisable:false
        });
        this.context.router.push('/app/libraries');
      }
    });

  }
  toggle(e) {
  e.preventDefault();
    this.setState({
      modal: !this.state.modal
    });
  }

  render(){
    let {errors}  = this.state;

    return(
      <Page>
        <BreadCrumb />
        <Row>
          <Col sm={{ size: 6, push: 2, pull: 2, offset: 1 }}>
          <Form onChange={this.checkTheFields}>
            <FormGroup>
              <Label>
                <h4>Edit Material</h4>
              </Label>
            </FormGroup>
            <FormGroup check>
              <FormGroup>
                <Label>Material Type</Label>
              </FormGroup>
              <FormGroup>
                <Label check>
                  <Input type="radio"
                   value="Video"
                   name = "video"
                   onChange={this.onRadioBtnChange}
                   checked={this.state.value === 'Video'}
                   disabled = {this.state.value !== 'Video'}/>{' '}
                    <span>Video</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Article"
                  name="article"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Article'} disabled = {this.state.value !== 'Article'} />{' '}
                    <span>Article</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="PDF"
                  name="pdf"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'PDF'} disabled = {this.state.value !== 'PDF'} />{' '}
                    <span>PDF</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Podcast"
                  name="podcast"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Podcast'} disabled = {this.state.value !== 'Podcast'}/>{' '}
                    <span>Podcast</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Editor"
                  name="editor"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Editor'} disabled={this.state.value !== 'Editor'} />{' '}
                    <span>Editor</span>
                </Label>
                <Label check>
                  <Input type="radio"
                  value="Link"
                  name="link"
                  onChange={this.onRadioBtnChange}
                  checked={this.state.value === 'Link'} disabled = {this.state.value !== 'Link'} />{' '}
                  <span>Link</span>
                </Label>
                </FormGroup>

                  <FormGroup color={errors.url ? "danger" : ""} className={(this.state.value == 'Editor') ? 'hide' : 'show'}>
                    <Label>URL</Label>
                      <Input type="url" name="url" id="url" value={this.state.url} placeholder="Enter the URL" onBlur={this.getmetadata} onChange={(e) => this.onChange(e, ['required'])} disabled={true}/>
                  {errors.url ? <FormFeedback>{errors.url}</FormFeedback> : "" }
                   </FormGroup>
                  <div id="loading" className={this.state.loading ? 'show': 'hide'}><img src='/assets/icon-loading.svg' /></div>
                  <FormGroup color={errors.title ? "danger" : ""}>
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
                  <FormGroup color={errors.estimated_time ? "danger" : ""} className={(this.state.value == 'Video')||(this.state.value == 'Link') ? 'hide' : 'show'}>
                    <Label>Est Reading Time</Label>
                      <Input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" id="24h" name="estimated_time" placeholder="hh:mm:ss" value={this.state.estimated_time} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.estimated_time ? <FormFeedback>{errors.estimated_time}</FormFeedback> : "" }
                  </FormGroup>



                <FormGroup>
                  <Label>Preview Image</Label><br/>
                  <Button className="btn-outline-primary btn-short btn-sm" onClick={this.toggle}>Select Stock Image</Button>{' '}
                  <Label className="btn btn-outline-primary btn-sm mb-0">
                    <Input type="file" onChange={this.fileUpload}/>
                    Upload
                  </Label>
                  <Modal isOpen={this.state.modal} toggle={this.toggle}>
                   <ModalHeader toggle={this.toggle}>Select Image</ModalHeader>
                    <SelectImage image_selected={this.selected_image} />
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
                  <span sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
                    <img src="/assets/icon-loading.svg"/>
                  </span>
                </div>}
                </FormGroup>
                <FormGroup style={{float:'right'}}>
                  <Button className="btn-primary btn-lg" loading={this.state.buttonloading} onClick={this.editMaterialClick} disabled={this.state.buttonDisable || this.state.buttonloading ? true : false}>Update</Button>{' '}
                  <Button size="lg" className="btn-cancel" color="cancel" onClick={this.resetClick}>Cancel</Button>
                </FormGroup>





              </FormGroup>

            </Form>
           </Col>
          </Row>
      </Page>

      );
  }

}
EditMaterial.contextTypes = {
  router: React.PropTypes.object.isRequired
};

EditMaterial.propTypes = {
 actions: PropTypes.object.isRequired,
 materials:PropTypes.array
 };
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth:state.auth,
    materials : state.materials
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMaterial);
