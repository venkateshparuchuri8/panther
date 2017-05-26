import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import * as actions from './actions/index';
import cookie from 'react-cookie';
import Iframe from 'react-iframe';
import axios from 'axios';


class SurveyModal extends Component {

  constructor(props) {
    super(props);
    this.state={
      modal: true,

    }
    this.toggle = this.toggle.bind(this);
    this.submitSurvey = this.submitSurvey.bind(this);
  }

  componentDidMount() {
    let me = this;
      axios.get('/api/survey/checksurveystatus?user_id='+cookie.load('user_obj').user_id+'')
  .then(function (response) {
    console.log(response);
    //console.log(response.data.result.survey_taken);
    me.setState({
      "survey_taken":response.data.result.survey_taken,
      "ismandatory":response.data.result.ismandatory,
      "survey_name":response.data.result.survey_name,
      "typeform_url":response.data.result.typeform_url,
      "survey_id":response.data.result.survey_id

    });
  })
  .catch(function (error) {
    console.log(error);
  });

  }
    toggle() {
      //debugger;
    this.setState({
      modal: !this.state.modal
    });

  }

  submitSurvey(e){
    this.setState({
      modal: !this.state.modal
    });
    const SurveyID = e.target.id;
    const surveyTaken = true;
    console.log(SurveyID+surveyTaken);
    this.setState({
      survey_taken:true
    });


    const obj={
       'user_id' : cookie.load('user_obj').user_id,
       'survey_id': this.state.survey_id,
       'survey_status':'completed'
    };
    this.props.actions.updateSurveyStat(obj);
  }

  render() {
    console.log(this.props.surveyStatus);
    return (
      <div>
      {this.state.survey_taken == "false" ?
          <Modal isOpen={this.state.modal}>
            <ModalHeader className={this.state.ismandatory==1 ? "survey-modal-header":null} toggle={this.toggle}>
              Take the survey - {this.state.survey_name}
              {this.state.ismandatory==1 ?
                <span className="is-mandatory text-muted">This survey is mandatory</span>
                :null}

            </ModalHeader>
            <ModalBody>
            <Iframe url={this.state.typeform_url}
            width="100%"
            height="450px"
            display="initial"
            position="relative"
            allowFullScreen/>
            </ModalBody>

          <ModalFooter>
            <Button id ={this.state.survey_id} size="lg" color="primary" onClick={this.submitSurvey}> Submit Survey </Button>
          </ModalFooter>
          </Modal>
      :null}
      </div>


    );
  }
}


function mapStateToProps(state) {
  // console.log(state);
  return {
    surveyStatUpdate:state.surveyStatUpdate
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
)(SurveyModal);
