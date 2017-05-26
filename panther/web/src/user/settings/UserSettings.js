import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Row, Col, FormGroup, Label, Input,Form,FormFeedback } from 'reactstrap';
import ChildPage from '../common/components/ChildPage';
import cookie from 'react-cookie';
import moment from 'moment';
import {validate} from '../../validators';
import * as actions from '../common/actions/index';
import Button from 'react-bootstrap-button-loader';
import toastr from 'toastr';
import axios from 'axios';



class UserSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'errors': {},
      'buttonDisable':true,
      'buttonloading':false,
      imageloading:false,
      state :cookie.load('user_obj').state

    };

    this.save = this.save.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.checkTheFields = this.checkTheFields.bind(this);
    this.dataSet = this.dataSet.bind(this);
  }

  componentWillMount(){
    this.dataSet();
    this.checkTheFields();

  }

  dataSet(){

    let dob = cookie.load('user_obj').dob;
    let dob_parsed;
    if(dob) {
      dob_parsed = moment(dob);
      console.log(dob_parsed.month()+1);
      console.log(dob_parsed.date());
      console.log(dob_parsed.year());
    }
    
    this.setState({
      userObj:cookie.load('user_obj'),
      name:cookie.load('user_obj').name,
      profile_pic:cookie.load('user_obj').profile_pic,
      gender:cookie.load('user_obj').gender,
      address:cookie.load('user_obj').address,
      city:cookie.load('user_obj').city,
      state:cookie.load('user_obj').state,
      zip_code:cookie.load('user_obj').zip_code,
      phone:cookie.load('user_obj').phone,
      chapter:cookie.load('user_obj').chapter,
      position:cookie.load('user_obj').position,
      profile_bio:cookie.load('user_obj').profile_bio,
      twitter:cookie.load('user_obj').twitter,
      facebook:cookie.load('user_obj').facebook,
      day: dob_parsed ? dob_parsed.date() : '',
      month:dob_parsed ? dob_parsed.month()+1 : '',
      year:dob_parsed ? dob_parsed.year() : ''
     });

    this.checkTheFields();

     let me = this;
      axios.get('/api/user/ribbons/list/'+cookie.load('user_obj').user_id+'')
  .then(function (response) {
    console.log(response);
    me.setState({
      "ribbonArray":response.data.result
    }); 
  })
  .catch(function (error) {
    console.log(error);
  });

  }


  onChange(e,validators = []){
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
    this.setState({errors, [e.target.name]: e.target.value});
    if(this.state.month && this.state.day && this.state.year && this.state.gender && this.state.address && this.state.city && (this.state.state || e.target.value ) && this.state.zip_code && this.state.chapter && this.state.position && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }

  }
  getRecentYears(count) {
    let currentYear = new Date().getFullYear(),
        years = [];

    while (count--) {
        years.push(currentYear--);
    }

    return years;
  }

  getDays(count) {

    //let initialYear = 1;
    let days = [];

    for(let i=1; i<=count; i++) {
      days.push(i);
    }

    return days;
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
              this.setState({'profile_pic' :data.files[0].url});
              this.setState({'imageloading':false});
              this.checkTheFields();
              this.save();
            }
          });
        }
      });
    }

  }
  checkTheFields(){
    if(this.state.month && this.state.day && this.state.year && this.state.gender && this.state.address && this.state.city && this.state.state && this.state.zip_code && this.state.chapter && this.state.position && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }
  save() {
    const obj={
      name:cookie.load('user_obj').name,
      user_id:cookie.load('user_obj').user_id,
      profile_pic:this.state.profile_pic,
      gender:this.state.gender,
      address:this.state.address,
      city:this.state.city,
      state:this.state.state,
      zip_code:this.state.zip_code,
      phone:this.state.phone,
      chapter:this.state.chapter,
      position:this.state.position,
      dob:this.state.year + '-' + this.state.month + '-' + this.state.day,
      profile_bio : this.state.profile_bio,
      twitter:this.state.twitter,
      facebook : this.state.facebook
    };
    console.log(obj);
    this.setState({buttonloading:true});
    fetch('/api/updateuser',{
        method:'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body:JSON.stringify(obj)
      }).then((response)=>{
        if(response.status === 200){
          return response.json().then(data => {
            const object =cookie.load('user_obj');
            object.user_id = data.result.user_id;
            object.dob = data.result.dob;
            object.gender = data.result.gender;
            object.address = data.result.address;
            object.city = data.result.city;
            object.zip_code = data.result.zip_code;
            object.phone = data.result.phone;
            object.chapter = data.result.chapter;
            object.position = data.result.position;
            object.profile_bio = data.result.profile_bio;
            object.twitter = data.result.twitter;
            object.facebook = data.result.facebook;
            console.log(object);
            cookie.save('user_obj', object, { path: '/' });
            toastr.success("Profile Uploaded Succesfully", "Success");
            this.setState({buttonloading:false});

          });

        }
      });
  }
  resetImage(e){
    e.preventDefault();
    this.setState({'profile_pic': '', buttonDisable: true});
  }

  render() {
    let {errors} = this.state, ribbons = [];
    if(this.state.ribbonArray){
    ribbons = this.state.ribbonArray.filter((user) => {
      return user.class_status == "completed";
    }).map(function(cls) {
      return cls.ribbon_url;
    });
    }

    return (
    <div>
    <ChildPage childPageType="userChild" backLink="/user/dashboard" backText="Back to Dashboard">
      <Row className="justify-content-md-center m-5">
        <Col sm="12" md="10">
          <div className="usersettings-top">
            <div className="usersettings-top-right">
              <div className="mr-3">
                <h3>{this.state.name}</h3>
                <p className="text-muted">{this.props.userPoints.totalPoints} XP</p>
              </div>
              <div className="leaderboard-user-top-avatar" style={{backgroundImage: `url(${this.state.profile_pic})`}}/>
            </div>
            <div className="usersettings-top-left">
              <Label className={'btn btn-primary btn-sm mb-0 ' + (this.state.imageloading ? 'loading' : '')}>
                    <Input type="file" onChange={this.fileUpload}/>
                    <span className="text">Upload New Image</span>
                    <span className="loader"><img src="/assets/icon-loading.svg"/></span>
              </Label>
              <span className="p-4" style={{cursor:'pointer'}} onClick={(e) => this.resetImage(e)}>
                <img src="/assets/icon-close.svg"/>Remove Image
              </span>

            </div>

          </div>
          <div className="usersettings-wrapper">
            <div className="right">
            <Form onChange={this.checkTheFields}>
              <FormGroup>
                <Label>Date of Birth**</Label>
                  <FormGroup row>
                    <Col md="4">
                      <FormGroup color={errors.year ? "danger" : ""}>
                        <Input type="select" name="year" id="year" size="sm" onChange={(e) => this.onChange(e, ['required'])} value={this.state.year}>
                          <option disabled value="year">Year</option>
                            {this.getRecentYears(80).map(year => <option value={year} key={year}>{year}</option>)}
                        </Input>
                      </FormGroup>
                      </Col>
                    <Col md="5">
                     <FormGroup color={errors.month ? "danger" : ""}>
                      <Input type="select" name="month" id="month" size="sm" onChange={(e) => this.onChange(e, ['required'])} value={this.state.month}>
                      <option selected disabled>Month</option>
                      <option value="01">Jan</option>
                      <option value="02">Feb</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </Input>
                    </FormGroup>
                    </Col>


                      <Col md="3" >
                       <FormGroup color={errors.day ? "danger" : ""}>
                        <Input type="select" name="day" id="day" size="sm" onChange={(e) => this.onChange(e, ['required'])} value={this.state.day}>
                          <option selected disabled>Day</option>
                          {this.getDays(moment(this.state.year + '-' + this.state.month).daysInMonth()).map(day => <option value={day} key={day}>{day}</option>)
                            }
                        </Input>
                       </FormGroup>
                       </Col>

                  </FormGroup>
              </FormGroup>
              <FormGroup color={errors.gender ? "danger" : ""}>
                <Label>Gender**</Label>
                <Input type="select" name="gender" size="sm"  value={this.state.gender} onChange={(e) => this.onChange(e, ['required'])}>
                  <option selected disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Input>
                {errors.gender ? <FormFeedback>{errors.gender}</FormFeedback> : "" }
              </FormGroup>
              <FormGroup>
                <Label>Address**</Label>
                <Input type="text" placeholder="Street and number, apartment, suite, unit, etc." name="address" value={this.state.address} onChange={(e) => this.onChange(e, ['required'])}/>
                {errors.address ? <FormFeedback>{errors.address}</FormFeedback> : "" }
              </FormGroup>
              <FormGroup>
                  <FormGroup row>
                    <Col md="5">
                    <FormGroup color={errors.city? "danger":""}>
                    <label>City</label>
                    <Input type="text" name="city" value={this.state.city} onChange={(e) => this.onChange(e, ['required'])}/>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup color={errors.state ? "danger" : ""}>
                    <label>State**</label>
                    <Input type="select" name="state" value={this.state.state} onChange={(e) => this.onChange(e, ['required'])} size="sm">
                        <option selected value="Alabama">AL</option>
                        <option value="Alaska">AK</option>
                        <option value="Arizona">AZ</option>
                        <option value="Arkansas">AR</option>
                        <option value="California">CA</option>
                        <option value="Colorado">CO</option>
                        <option value="Connecticut">CT</option>
                        <option value="Delaware">DE</option>
                        <option value="District Of Columbia">DC</option>
                        <option value="Florida">FL</option>
                        <option value="Georgia">GA</option>
                        <option value="Hawaii">HI</option>
                        <option value="Idaho">ID</option>
                        <option value="Illinois">IL</option>
                        <option value="Indiana">IN</option>
                        <option value="Iowa">IA</option>
                        <option value="Kansas">KS</option>
                        <option value="Kentucky">KY</option>
                        <option value="Louisiana">LA</option>
                        <option value="Maine">ME</option>
                        <option value="Maryland">MD</option>
                        <option value="Massachusetts">MA</option>
                        <option value="Michigan">MI</option>
                        <option value="Minnesota">MN</option>
                        <option value="Mississippi">MS</option>
                        <option value="Missouri">MO</option>
                        <option value="Montana">MT</option>
                        <option value="Nebraska">NE</option>
                        <option value="Nevada">NV</option>
                        <option value="New Hampshire">NH</option>
                        <option value="New Jersey">NJ</option>
                        <option value="New Mexico">NM</option>
                        <option value="New York">NY</option>
                        <option value="North Carolina">NC</option>
                        <option value="North Dakota">ND</option>
                        <option value="Ohio">OH</option>
                        <option value="Oklahoma">OK</option>
                        <option value="Oregon">OR</option>
                        <option value="Pennsylvania">PA</option>
                        <option value="Rhode Island">RI</option>
                        <option value="South Carolina">SC</option>
                        <option value="South Dakota">SD</option>
                        <option value="Tennessee">TN</option>
                        <option value="Texas">TX</option>
                        <option value="Utah">UT</option>
                        <option value="Vermont">VT</option>
                        <option value="Virginia">VA</option>
                        <option value="Washington">WA</option>
                        <option value="West Virginia">WV</option>
                        <option value="Wisconsin">WI</option>
                        <option value="Wyoming">WY</option>
                        <option value="American Samoa">AS</option>
                        <option value="Guam">GU</option>
                        <option value="Northern Mariana Islands">MP</option>
                        <option value="Puerto Rico">PR</option>
                        <option value="United States Minor Outlying Islands">UM</option>
                        <option value="Virgin Islands">VI</option>
                    </Input>
                  </FormGroup>
                  </Col>
                  <Col md="4">
                  <FormGroup color={errors.zip_code ? "danger":""}>
                    <label>ZIP**</label>
                    <Input type="text" maxLength="5" name="zip_code" value={this.state.zip_code} onChange={(e) => this.onChange(e, ['required'])}/>
                  </FormGroup>
                  </Col>
                  </FormGroup>
              </FormGroup>
              <FormGroup>
                <Label>Phone Number**</Label>
                  <Col md="6">
                  <FormGroup row color={errors.phone ? "danger":""}>
                    <Input type="text" name="phone" maxLength="10" value={this.state.phone} onChange={(e) => this.onChange(e, ['required'])}/>
                  </FormGroup>
                  </Col>
              </FormGroup>
              <FormGroup>
                  <FormGroup row>
                    <Col md="6">
                    <FormGroup color={errors.chapter ? "danger" : ""}>
                     <label>Chapter*</label>
                    <Input type="text" name="chapter" value={this.state.chapter} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.chapter ? <FormFeedback>{errors.chapter}</FormFeedback> : "" }
                  </FormGroup>
                  </Col>
                  <Col md="6">
                  <FormGroup>
                   <label>Position*</label>
                    <Input type="text" name="position" value={this.state.position} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.position ? <FormFeedback>{errors.position}</FormFeedback> : "" }
                  </FormGroup>
                  </Col>
                  </FormGroup>
              </FormGroup>
              <FormGroup>
                <Label>Bio</Label>
                <FormGroup row>
                  <Col md="12">
                    <Input type="textarea" name="profile_bio" value={this.state.profile_bio} onChange={(e) => this.onChange(e, [])} maxLength="150"/>
                  </Col>
                </FormGroup>
              </FormGroup>
              <FormGroup>
                <Label>Twitter</Label>
                <Input type="text" name="twitter" value={this.state.twitter} onChange={(e) => this.onChange(e, ['url'])} placeholder=""/>
              </FormGroup>
              <FormGroup>
                <Label>Facebook</Label>
                <Input type="text" name="facebook" value={this.state.facebook} onChange={(e) => this.onChange(e, ['url'])} placeholder=""/>
              </FormGroup>
              <FormGroup>
                <p className="text-muted mb-1 font-italic">* Required fields</p>
                <p className="text-muted font-italic">** Required, won’t show on public profile</p>
              </FormGroup>
              <FormGroup>
                <Button  size="sm" color="primary" className="btn-primary btn-lg" onClick={this.save} loading={this.state.buttonloading} disabled={this.state.buttonDisable|| this.state.buttonloading ? true : false}>Save</Button>
              </FormGroup>
              </Form>
            </div>
            <div className="left" style={{width:'425px'}}>
              <label>Ribbons</label>
              {ribbons.length == 0 ? <p>No ribbons earned yet.</p>
              :
              <ul>
                {ribbons.map((url) => {
                  return (
                    <li className="r-1">
                      <div className="r-1-image"><img className="r-1-image" src={url}/></div>
                    </li>
                  )
                })}
              </ul>
              }
            </div>
          </div>
        </Col>
      </Row>
    </ChildPage>
    </div>

    );
  }
}

UserSettings.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    userPoints:state.userPoints
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettings);

