import React,{Component} from 'react';
import {Input , Form , Label , FormGroup,Button, Modal, ModalHeader,ModalFooter} from 'reactstrap';
import RWBEditor from '../libraries/Editor';
import SelectImage from '../libraries/SelectImage';
import toastr from 'toastr';
import {convertToHTML} from 'draft-convert';
import AddQuestion from '../libraries/AddQuestion';

class EditMaterial extends Component{
  constructor(props){
    super(props);
    this.state = {}
    this.cancelPreviewImage = this.cancelPreviewImage.bind(this);
    this.updateMaterial = this.updateMaterial.bind(this);
    this.selected_image = this.selected_image.bind(this);
    this.fileUpload  = this.fileUpload.bind(this);
    this.image_submit = this.image_submit.bind(this);
    this.onChange= this.onChange.bind(this);
    this.contentChange = this.contentChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.resetClick = this.resetClick.bind(this);
    this.questiondata  = this.questiondata.bind(this);
   }

  componentDidMount() {
    if(this.props.materialData && this.props.materialData.length){
      this.setState({
        'value': this.props.materialType,
        'questions': this.props.materialData
      });
    }else if(this.props.materialData){
      this.setState({
        'value': this.props.materialType,
        'content': this.props.materialData.content,
        'title': this.props.materialData.title,
        'url': this.props.materialData.url,
        'author': this.props.materialData.author,
        'hero_image': this.props.materialData.hero_image,
        'estimated_time': this.props.materialData.estimated_time,
        'question': this.props.materialData.question
      });
    }
  }

  componentWillReceiveProps(props) {
    if(props.materialData && props.materialData.length){
      this.setState({
        'value':props.materialType,
        'questions':props.materialData
      });
    }else if(props.materialData){
      this.setState({
        'value':props.materialType,
        'content':props.materialData.content,
        'title':props.materialData.title,
        'url':props.materialData.url,
        'author':props.materialData.author,
        'hero_image':props.materialData.hero_image,
        'estimated_time':props.materialData.estimated_time,
        'question':props.materialData.question
      });
    }
  }

  questiondata(questions){
    this.setState({
      questions:questions
    });

  }
  cancelPreviewImage(e){
    e.preventDefault();
    this.setState({'hero_image':''});
  }
  resetClick(e){
    e.preventDefault();
    this.setState({
      'content':'',
      'title':'',
      'author':'',
      'hero_image':'',
      'estimated_time':'',
      'question':''

    });
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
      this.toggle(e);
    }
 }
 cancel(e){
    e.preventDefault();
    this.setState({'hero_image':''});
    this.toggle(e);
  }

  selected_image(id){
    this.setState({'hero_image':id});
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
            }
          });
        }
      });
    }

  }
  updateMaterial(e){
    e.preventDefault();
    const object={};
    object.title = this.state.title;
    object.estimated_time = this.state.estimated_time;
    object.author = this.state.author;
    object.content = this.state.content;
    object.hero_image = this.state.hero_image;
    object.material_type = this.state.value;
    if(this.state.value == 'Quiz'){
      object.questions = this.state.questions;
    }else if(this.state.value == 'Reflection'){
      object.question = this.state.question;
    }
    this.props.updateMaterialdataCallback(object);
  }
  contentChange(val){
    this.setState({content:convertToHTML(val.editorState.getCurrentContent())});
  }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  render(){

    return (
      <Form>
        <FormGroup check>
          <FormGroup className="mb-0">
            <Label>Material Type</Label>
          </FormGroup>
          
          <FormGroup className="border-wrapper">
            <Label check>
              <Input type="radio"
               value="Video"
               name = "video"
               disabled = {true}
               checked={this.state.value === 'Video'}/>{' '}
                <span>Video</span>
            </Label>
            <Label check>
              <Input type="radio"
              value="Article"
              name="article"
              disabled = {true}
              checked={this.state.value === 'Article'}/>{' '}
                <span>Article</span>
            </Label>
            <Label check>
              <Input type="radio"
              value="PDF"
              name="pdf"
              disabled = {true}
              checked={this.state.value === 'PDF'}/>{' '}
                <span>PDF</span>
            </Label>
            <Label check>
              <Input type="radio"
              value="Podcast"
              name="podcast"
              disabled = {true}
              checked={this.state.value === 'Podcast'}/>{' '}
                <span>Podcast</span>
            </Label>
            <Label check>
              <Input type="radio"
              value="Editor"
              name="editor"
              disabled = {true}
             checked={this.state.value === 'Editor'}/>{' '}
                <span>Editor</span>
            </Label>
            <Label check>
              <Input type="radio"
              value="Link"
              name="link"
              disabled = {true}
              checked={this.state.value === 'Link'}/>{' '}
              <span>Link</span>
            </Label>
            <FormGroup className="mt-1 mb-0">
              <Label check>
                <Input type="radio"
                  value="Quiz"
                  name="quiz"
                  disabled = {true}
                  checked={this.state.value === 'Quiz'}/>{' '}
                <span>Quiz</span>
              </Label>
              <Label check>
                <Input type="radio"
                value="Reflection"
                name="reflection"
                disabled = {true}
                checked={this.state.value === 'Reflection'}/>{' '}
                <span>Reflection</span>
              </Label>
            </FormGroup>
          </FormGroup>
        </FormGroup>

        <FormGroup className={(this.state.value == 'Editor')|| (this.state.value == 'Reflection') || (this.state.value == 'Quiz') ? 'hide' : 'show'}>
          <Label>URL</Label>
          <Input type="url" name="url" id="url" value={this.state.url} placeholder="Enter the URL" disabled={true} onChange={this.onChange} />
        </FormGroup>

        <div id="loading" className={this.state.loading ? 'show': 'hide'}>
          <img src="/assets/icon-loading.svg" />
        </div>

        <FormGroup className={(this.state.value == 'Reflection') || (this.state.value == 'Quiz')? 'hide':'show'}>
          <Label>Title</Label>
          <Input type="text" name="title" id="title" placeholder="Title" value={this.state.title} onChange={this.onChange}/>
        </FormGroup>

        <FormGroup className={(this.state.value == 'Video') ? 'show' : 'hide'}>
          <Label>Duration</Label>
          <Input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" id="24h" name="estimated_time" placeholder="hh:mm:ss" value={this.state.estimated_time} onChange={this.onChange}/>
        </FormGroup>

        <FormGroup className={(this.state.value == 'Article')||(this.state.value == 'Podcast') ? 'show' : 'hide'}>
          <Label>Author Name</Label>
          <Input type="text" name="author" id="author" placeholder="Author Name" value={this.state.author} onChange={this.onChange}/>
        </FormGroup>

        <FormGroup className={(this.state.value == 'Editor')? 'show' : 'hide'}>
          <Label>Content</Label>
          <RWBEditor value={this.state.content} name="content" change={this.contentChange}/>
        </FormGroup>

        <FormGroup className={(this.state.value == 'Video')||(this.state.value == 'Link')|| (this.state.value == 'Reflection') || (this.state.value == 'Quiz')? 'hide' : 'show'}>
          <Label>Est Reading Time</Label>
          <Input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" id="24h" name="estimated_time" placeholder="hh:mm:ss" value={this.state.estimated_time} onChange={this.onChange}/>
        </FormGroup>

        <FormGroup className={(this.state.value == 'Reflection') || (this.state.value == 'Quiz') ? 'hide' : 'show'}>
          <Label>Preview Image</Label><br/>
          <Button size="sm" className="btn-short" color="primary" outline onClick={this.toggle}>Select Stock Image</Button>{' '}
          <Label className="btn btn-outline-primary btn-sm mb-0">
            <Input type="file" onChange={this.fileUpload}/>
            Upload
          </Label>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Select Image</ModalHeader>
              <SelectImage image_selected={this.selected_image}/>
            <ModalFooter>
              <Button size="lg" color="primary" onClick={this.image_submit}>Done</Button>
              <Button size="lg" className="btn-cancel" color="cancel" onClick={this.cancel}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </FormGroup>

        {this.state.value == 'Quiz' ? <AddQuestion questionfrom="edit" questions={this.state.questions} addquestion={this.questiondata}/> : ''}
              
        {this.state.value == 'Reflection' ?
          <FormGroup>
              <Label>Question</Label>
              <Input type="text" placeholder="Here will be question" name="question" value={this.state.question} onChange={this.onChange}/>
          </FormGroup> 
        : '' }

        <FormGroup>
          {!this.state.imageloading && (this.state.value != 'Quiz' && this.state.value != 'Reflection') ?
            <div className="thumbnail-container">
              <div className={this.state.hero_image ? 'thumbnail' : 'hide'} style={{backgroundImage: 'url(' + this.state.hero_image + ')'}}>
                <a onClick={this.cancelPreviewImage} className="thumbnail-remove"/>
              </div>
            </div>
            :
            <div className={this.state.imageloading ? '' : 'hide'}>
              <div sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
                <img src="/assets/icon-loading.svg"/>
              </div>
            </div>
          }
        </FormGroup>
        <FormGroup style={{float:'right'}}>
          <Button size="lg" color="primary" onClick={this.updateMaterial}>Update</Button>
          {'   '}<Button size="lg" className="btn-cancel" color="cancel" onClick={this.resetClick}>Cancel</Button>
        </FormGroup>
      </Form>
    );
  }
}
export default EditMaterial;
