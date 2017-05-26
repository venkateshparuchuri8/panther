import React, {Component,PropTypes }  from 'react';
import { Form, FormGroup, Label, Input, ModalBody, FormFeedback} from 'reactstrap';
import Button from 'react-bootstrap-button-loader';
import cookie from 'react-cookie';
import {validate} from '../../validators';


class CourseCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
       'ribbons':[],
       'ribbonsUpdate':[],
       'is_supplemental':'yes',
       'errors': {},
       'loading':false,
       'buttonDisable':true
    };

    this.createCourse=this.createCourse.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.uploadRibbon=this.uploadRibbon.bind(this);
    this.closingActions=this.closingActions.bind(this);
    this.checkTheFields=this.checkTheFields.bind(this);
  }
  componentWillMount(){
    if (this.props.course_obj) {
      let arrayList=[];
        if(this.props.course_obj.ribbons && this.props.course_obj.ribbons.length > 0){
          arrayList = this.props.course_obj.ribbons.map((item) => item.ribbon_url);
        }
        this.setState({
            'course_id': this.props.course_obj.id,
            'course_name': this.props.course_obj.name,
            'course_description': this.props.course_obj.description,
            'ribbons':arrayList,
            'is_supplemental':this.props.course_obj.is_supplemental
        });

    }
  }

  // onChange(e){
  //   this.setState({[e.target.name] : e.target.value});
  // }

  handleChange(e, validators = []) {
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
    if(e.target.name == "is_supplemental"){
      this.setState({errors, 'is_supplemental': (this.state.is_supplemental == "yes") ? "no" : "yes"});
    }else{
        this.setState({errors, [e.target.name]: e.target.value});
    }
  }

  checkTheFields(){
    if(this.state.course_name && this.state.course_description && this.state.ribbons.length > 0 && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }

  createCourse (event) {
    event.preventDefault();
    //const name=event.target.course_name.value;
    //const description=event.target.course_description.value;
    let is_supplemental='';
    if(this.state.is_supplemental == 'yes'){
      is_supplemental='yes';
    }else{
      is_supplemental='no';
    }

    const obj={
      'name':this.state.course_name,
      'description':this.state.course_description,
      'is_supplemental':is_supplemental,
      'organization_id':cookie.load('org_obj').org_id,
      'created_user':cookie.load('org_obj').user_id,
      'modified_user':cookie.load('org_obj').user_id
    };
    if(event.target.id){
      obj.id=event.target.id;
      if(this.state.ribbonsUpdate.length > 0){
        obj.ribbons=this.state.ribbonsUpdate;
      }
    }else{
      obj.ribbons=this.state.ribbons;
    }
    this.props.creatorupdate(obj);
  }

  closingActions(event){
    event.preventDefault();
    this.props.closeAction();
  }

  uploadRibbon(event){
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
              if(this.state.course_id){
                let updateRibbons=this.state.ribbonsUpdate;
                updateRibbons.push(data.files[0].url);
                this.setState({'ribbonsUpdate' :updateRibbons});
              }
              let ribbonsArray=this.state.ribbons;
              ribbonsArray.push(data.files[0].url);
              this.setState({'ribbons' :ribbonsArray});
              this.setState({'loading':false});
              if(this.state.course_name && this.state.course_description && this.state.ribbons.length > 0){
                  this.setState({'buttonDisable':false});
              }
              //toastr.success("Image Uploaded Succesfully", "Success");
            }
          });
        }
      });
    }

  }

  render() {
    const courseRibbons=this.state.ribbons;
    const {errors} = this.state;
    return (
    <div>
    <ModalBody>
      <Form onChange={this.checkTheFields}>
        <FormGroup color={errors.course_name ? "danger" : ""}>
					<Label for="courseName">Course Name</Label>
          <Input type="text" name="course_name" value={this.state.course_name} onChange={(e) => this.handleChange(e, ['required'])} id="courseName" required state={errors.course_description ? "danger" : ""} />
          {errors.course_name ? <FormFeedback>{errors.course_name}</FormFeedback> : "" }
        </FormGroup>
        <FormGroup color={errors.course_description ? "danger" : ""}>
					<Label for="courseDescription">Course Description</Label>
          <Input type="text" name="course_description" value={this.state.course_description} onChange={(e) => this.handleChange(e, ['required'])} id="courseDescription" required state={errors.course_description ? "danger" : ""} />
          {errors.course_description ? <FormFeedback>{errors.course_description}</FormFeedback> : "" }
        </FormGroup>
        <FormGroup>
          <span className="mr-2">Ribbons</span>
          <span>
            <Label className={this.state.loading ? "btn btn-outline-primary btn-sm mb-0 disabled" : "btn btn-outline-primary btn-sm mb-0"}>
            <Input type="file" disabled={this.state.loading} onChange={this.uploadRibbon} required />Upload
            </Label>
          </span>

        </FormGroup>
        <FormGroup>
          {courseRibbons.map((url,i) =>
            <div className="r-1" key={i}>
              <div className="r-1-name">R{i+1}</div>
              <div className="r-1-image" style={{backgroundImage: 'url(' + url + ')'}}></div>
            </div>
          )}
          <span className={this.state.loading ? '' : 'hide'}>
          <span sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
          <img src="/assets/icon-loading.svg"/>
           </span>
          </span>
        </FormGroup>
        <FormGroup>
          <Label check>
            <Input type="checkbox" name="is_supplemental" checked={this.state.is_supplemental === 'yes'} value={this.state.is_supplemental} onChange={this.handleChange} />
            <span>Set as Supplemental</span>
          </Label>
        </FormGroup>
        <FormGroup className="float-right">

        <Button loading={this.props.buttonLoading} className="btn-primary btn-lg" onClick = {this.createCourse} id={this.state.course_id} disabled={this.state.buttonDisable || this.state.loading ? true : false}>{this.props.cFormStatus == 'edit' ? 'Save':'Create'}</Button>{' '}
        <Button size="lg" className="btn-cancel" onClick={this.closingActions}>Cancel</Button>
        </FormGroup>
      </Form>
    </ModalBody>
    </div>
    );
  }
}

CourseCreateForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

CourseCreateForm.propTypes = {
 auth: PropTypes.object
};



export default CourseCreateForm;
