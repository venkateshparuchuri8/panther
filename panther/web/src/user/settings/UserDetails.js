import React, {Component} from 'react';
import { Row, Col, FormGroup, Label, Input ,FormFeedback,Form} from 'reactstrap';
import Button from 'react-bootstrap-button-loader';
import moment from 'moment';
import Isvg from 'react-inlinesvg';
import {validate} from '../../validators';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

class UserDetails extends Component{
  constructor(props){
    super(props);
    this.state = {
      'errors': {},
      'buttonDisable':true,
      'buttonloading':false,
      state :'Alabama'

      };

    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
    this.checkTheFields=this.checkTheFields.bind(this);
  }
  componentWillReceiveProps(){
    this.setState({'gender' : cookie.load('user_obj').gender });

  }
  onChange(e,validators = []){
    let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
    this.setState({errors, [e.target.name]: e.target.value});
     if(this.state.month && this.state.day && this.state.year && this.state.gender && this.state.address && this.state.city && (this.state.state||e.target.value) && this.state.zip_code && this.state.chapter && this.state.position && (Object.keys(this.state.errors).length) == 0){
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

  save(e) {
    e.preventDefault();
    const obj={
      'dob':this.state.year+'-'+this.state.month +'-'+ this.state.day  ,
      'gender':this.state.gender,
      'address':this.state.address,
      'state':this.state.state,
      'zip_code':this.state.zip_code,
      'phone':this.state.phone,
      'chapter':this.state.chapter,
      'position':this.state.position,
      'profile_bio':this.state.profile_bio,
      'twitter':this.state.twitter,
      'facebook':this.state.facebook,
      'city' : this.state.city,
      'user_id' : cookie.load('user_obj').user_id,
      'profile_pic':cookie.load('user_obj').profile_pic

    };
    console.log(obj);
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
            browserHistory.replace('/user/dashboard');
          });

        }
      });

  }
  checkTheFields(){
    debugger;
    if(this.state.month && this.state.day && this.state.year && this.state.gender && this.state.address && this.state.city && this.state.state && this.state.zip_code && this.state.chapter && this.state.position && (Object.keys(this.state.errors).length) == 0){
       this.setState({'buttonDisable':false});
    }else{
       this.setState({'buttonDisable':true});
    }
  }
  render(){
    let {errors}  = this.state;

    return (
      <div>
      <Form onChange={this.checkTheFields}>
      <Row className="justify-content-md-center m-5">
        <div className="mr-3">
          <h3>Welcome aboard,{' '}{cookie.load('user_obj').name}</h3>
          <p className="text-muted">In order to proceed, please fill required information below:</p>
        </div>
      </Row>
      <Row className="justify-content-md-center m-5">
        <Col sm="12" md="4">
          <div>
            <div className="right">
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
                <Input type="select" name="gender" id="gender"  size="sm" onChange={(e) => this.onChange(e, ['required'])} value={this.state.gender}>
                  <option selected disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Input>

              </FormGroup>
              <FormGroup color={errors.address ? "danger" : ""}>
                <Label>Address**</Label>
                <Input type="text" name="address" id="address" value={this.state.address} placeholder="Street and number, apartment, suite, unit, etc." onChange={(e) => this.onChange(e, ['required'])}/>
                {errors.address ? <FormFeedback>{errors.address}</FormFeedback> : "" }

              </FormGroup>
              <FormGroup>
                  <FormGroup row>
                      <Col md="5">
                      <FormGroup color={errors.city ? "danger" : ""}>
                        <label>City**</label>
                        <Input type="text" name="city" id="city" value={this.state.city} onChange={(e) => this.onChange(e, ['required'])}/>
                     </FormGroup>
                     </Col>
                     <Col md="3">

                    <FormGroup color={errors.state ? "danger" : ""}>
                        <label>State**</label>
                        <Input type="select" name="state" id="state" size="sm" value={this.state.state} onChange={(e) => this.onChange(e, ['required'])}>
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
                  <FormGroup color={errors.zip_code ? "danger" : ""}>

                    <label>ZIP**</label>
                    <Input type="text" name="zip_code" id="zip_code" maxLength="5" value={this.state.zip_code} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.zip_code ? <FormFeedback>{errors.zip_code}</FormFeedback> : "" }

                 </FormGroup>
                  </Col>
                  </FormGroup>
                  </FormGroup>
              <FormGroup>
                <Label>Phone Number**</Label>
                 <Col md="6">
                 <FormGroup row color={errors.phone ? "danger" : ""}>
                  <Input type="text" name="phone" id="phone" maxLength="10" value={this.state.phone} onChange={(e) => this.onChange(e, ['required'])}/>
                  {errors.phone ? <FormFeedback>{errors.phone}</FormFeedback> : "" }

                </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                  <FormGroup row>
                    <Col md="6">
                    <FormGroup color={errors.chapter ? "danger" : ""}>
                    <label>Chapter*</label>
                    <Input type="text" name="chapter" id="chapter" value={this.state.chapter} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.chapter ? <FormFeedback>{errors.chapter}</FormFeedback> : "" }
                    </FormGroup>
                  </Col>
                  <Col md="6">
                  <FormGroup color={errors.position ? "danger" : ""}>
                    <label>Position*</label>
                    <Input type="text" name="position" id="position" value={this.state.position} onChange={(e) => this.onChange(e, ['required'])}/>
                    {errors.position ? <FormFeedback>{errors.position}</FormFeedback> : "" }

                  </FormGroup>
                   </Col>

              </FormGroup>
              <FormGroup>
                <FormGroup row>
                  <Col md="8">
                    <p className="text-muted mb-1 font-italic">* Required fields</p>
                    <p className="text-muted font-italic">** Required, won’t show on public profile</p>
                  </Col>
                  <Col md="4">
                    <Button size="sm" color="primary" className="btn-primary btn-lg" loading={this.state.buttonloading} onClick={this.save} disabled={this.state.buttonDisable || this.state.buttonloading ? true : false }>
                      <Isvg src="/assets/icon-answer-next.svg" />Proceed
                    </Button>
                  </Col>
                </FormGroup>
              </FormGroup>
              </FormGroup>
            </div>
          </div>
        </Col>
      </Row>
      </Form>

      </div>
    );
  }
}

export default UserDetails;
