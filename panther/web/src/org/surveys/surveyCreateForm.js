import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input, ModalBody, Row, Col} from 'reactstrap';
import * as actions from '../common/actions/index';
import cookie from 'react-cookie';
let _ = require('lodash');



class SurveyCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
                 };

        // this.createSurvey=this.createSurvey.bind(this);
        this.startSurvey = this.startSurvey.bind(this);
        this.draftSurvey = this.draftSurvey.bind(this);
        this.cancelSurvey = this.cancelSurvey.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
        this.onRadioBtnChange1 = this.onRadioBtnChange1.bind(this);


    }
     componentDidMount() {
    let allowStart;
       let surveyStartCheck = _.find(this.props.surveys, {survey_status: 'started'});
             if(surveyStartCheck == undefined){
              allowStart = true;
            }
            else if(surveyStartCheck != undefined){
              allowStart = false;
            }
              this.setState({
                allowStart:allowStart
              })
  }

     componentWillMount(){

      if(this.props.survey_obj){
        let piButtonVal1,piButtonVal2, imButtonVal1, imButtonVal2;
        if(this.props.survey_obj.personal_info == '1'){
          piButtonVal1 = true;
          piButtonVal2 = false;
        }
        if(this.props.survey_obj.personal_info == '0'){
          piButtonVal1 = false;
          piButtonVal2 = true;
        }

        if(this.props.survey_obj.is_mandatory == '1'){
          imButtonVal1 = true;
          imButtonVal2 = false;
        }
        if(this.props.survey_obj.is_mandatory == '0'){
          imButtonVal1 = false;
          imButtonVal2 = true;
        }
    this.setState({
        'survey_name':this.props.survey_obj.survey_name,
        'x_p':this.props.survey_obj.survey_points,
        'piButtonVal1':piButtonVal1,
        'piButtonVal2':piButtonVal2,
        'imButtonVal1':imButtonVal1,
        'imButtonVal2':imButtonVal2,
        'isMandatory': this.props.survey_obj.is_mandatory,
        'personal_info':this.props.survey_obj.personal_info,
        'typeform_id':this.props.survey_obj.typeform_id
    });

    }

  }

    onRadioBtnChange(e) {
    
          this.setState({ 
          value: e.target.value,

        });

           if(this.props.survey_obj){
                  let piButtonVal1, piButtonVal2;

            if(e.target.value == '1'){
                piButtonVal1 = 1;
                piButtonVal2 = 0;              
            }
            if(e.target.value == '0'){
              piButtonVal1 = 0;
              piButtonVal2 = 1;
            }
        
        this.setState({
            piButtonVal1 : piButtonVal1,
            piButtonVal2 : piButtonVal2,
            value: e.target.value
            
        });
          
      }
    }
     onRadioBtnChange1(e) {
    
        this.setState({ value1: e.target.value });

             if(this.props.survey_obj){
              let imButtonVal1, imButtonVal2;

            if(e.target.value == '1'){
                imButtonVal1 = 1;
                imButtonVal2 = 0;              
            }
            if(e.target.value == '0'){
              imButtonVal1 = 0;
              imButtonVal2 = 1;
            }
        
        this.setState({
            imButtonVal1 : imButtonVal1,
            imButtonVal2 : imButtonVal2,
            value1 : e.target.value
            
        });
      
      }
    }
   handleChange(e) {
     this.setState({[e.target.name]: e.target.value });
    }
   cancelSurvey(event){
      event.preventDefault();
      this.props.closeAction();
     
    }
    startSurvey(event) {
        event.preventDefault();
        let personalInfo = '';
        if (this.state.value == '1') {
            personalInfo = 1;
        }
        if (this.state.value == '0') {
            personalInfo = 0;
        }

        let isMandatory = '';
        if (this.state.value1 == '1') {
            isMandatory = 1;
        }
        if (this.state.value1 == '0') {
            isMandatory = 0;
        }
        if(this.state.value1 == undefined){
          isMandatory = this.props.survey_obj.is_mandatory;
        }
        if(this.state.value == undefined){
            personalInfo = this.props.survey_obj.personal_info;
        }
        const Obj = {};
        Obj.survey_name = this.state.survey_name;
        Obj.isMandatory = isMandatory;
        Obj.typeForm_id = this.state.typeform_id;
        Obj.organization_id = cookie.load('org_obj').org_id;
        Obj.user_id = cookie.load('org_obj').user_id;
        Obj.points = this.state.x_p;
        Obj.personal_info = personalInfo;
        Obj.status = "started";
          //debugger;
        //console.log(Obj);
        if(this.props.survey_obj){
          Obj.survey_id = this.props.survey_obj.survey_id;
        this.props.actions.updateSurvey(Obj);
        }else{
        this.props.actions.surveyCreation(Obj);
      }
    }

    draftSurvey(event) {
        event.preventDefault();
        event.preventDefault();
        let personalInfo = '';
        if (this.state.value == '1') {
            personalInfo = 1;
        }
        if (this.state.value == '0') {
            personalInfo = 0;
        }

          let isMandatory = '';
        if (this.state.value1 == '1') {
            isMandatory = 1;
        }
        if (this.state.value1 == '0') {
            isMandatory = 0;
        }
         if(this.state.value1 == undefined){
          isMandatory = this.props.survey_obj.is_mandatory;
        }
        if(this.state.value == undefined){
            personalInfo = this.props.survey_obj.personal_info;
        }
        const Obj = {};
        Obj.survey_name = this.state.survey_name;
        Obj.isMandatory = isMandatory;
        Obj.typeForm_id = this.state.typeform_id;
        Obj.organization_id = cookie.load('org_obj').org_id;
        Obj.user_id = cookie.load('org_obj').user_id;
        Obj.points = this.state.x_p;
        Obj.personal_info = personalInfo;
        Obj.status = "drafted";
       // debugger;

         if(this.props.survey_obj){
          Obj.survey_id = this.props.survey_obj.survey_id;
        this.props.actions.updateSurvey(Obj);
        }else{
        this.props.actions.surveyCreation(Obj);
      }
    }


    render() {
        return (
          <div>
            <ModalBody>
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for = "surveyName" > Survey Name </Label>
                        <Input type = "text" name = "survey_name" id = "surveyName" value = {this.state.survey_name} onChange={this.handleChange} />
                      </FormGroup>
                  </Col>
                  <Col xs = "3">
                    <FormGroup>
                      <Label for = "xp"> XP</Label>
                        <Input type = "text" name = "x_p" id = "xp" value = {this.state.x_p} onChange={this.handleChange} />
                    </FormGroup>
                  </Col>
                </Row>

                    <FormGroup>
                    <Label for = "typeFormId" > Typeform From ID </Label>
                    <Input type = "text" name = "typeform_id" id = "typeFormId" value = {this.state.typeform_id} onChange={this.handleChange} />
                    </FormGroup>

                <Row>
                <Col md="6">
                  <Label for="pi">Collect personal information</Label>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value ='1' onChange = {this.onRadioBtnChange} checked={ this.props.survey_obj ? this.state.piButtonVal1 : null }/>{' '}
                      <span>Yes</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value ='0' onChange = {this.onRadioBtnChange} checked={ this.props.survey_obj ? this.state.piButtonVal2 : null }/>{' '}
                      <span>No</span>
                    </Label>
                  </FormGroup>
                 </Col>
                <Col md="6">
                  <Label for="pi">Make this survey mandatory?</Label>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio2" value ='1' onChange = {this.onRadioBtnChange1} checked={ this.props.survey_obj ? this.state.imButtonVal1 : null}/>{' '}
                      <span>Yes</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio2" value ='0' onChange = {this.onRadioBtnChange1} checked={ this.props.survey_obj ? this.state.imButtonVal2 : null }/>{' '}
                      <span>No</span>
                    </Label>
                  </FormGroup>
                 </Col>
                 </Row>
                <FormGroup className="float-right mt-3">
                <Button size="lg" color="ternary" name="draft" onClick={this.draftSurvey} >Save as Draft</Button>{' '}
                {this.state.allowStart ?
                <Button size="lg" color="primary" type="submit" name="create" onClick={this.startSurvey}>Create </Button>
                :<Button size="lg" color="primary" type="submit" name="create" onClick={this.draftSurvey}>Create </Button>
              }
                <Button size="lg" className="btn-cancel" color="cancel" onClick={this.cancelSurvey}> Cancel </Button>{' '}
                </FormGroup>
              </Form>
            </ModalBody>
          </div>
        );
    }
}

SurveyCreateForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        surveys: state.surveys,
        editSurvey:state.editSurvey
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyCreateForm);
