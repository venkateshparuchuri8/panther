import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../common/components/Page';
import { Button, Modal, ModalHeader, Row, Col, Input} from 'reactstrap';
import SurveyTable from './surveyTables';
import SurveyCreateForm from './surveyCreateForm';
import * as actions from '../common/actions/index';
import cookie from 'react-cookie';
var _ = require('lodash')
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Surveys extends Component {
    constructor(props) {
    super(props);
    this.state = {
      modal: false,
      dropDownValue: "all"
    };

    this.toggle = this.toggle.bind(this);
    this.getSurvey=this.props.actions.getSurvey.bind(this);
    this.editSurvey=this.editSurvey.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }


  componentDidMount() {
    //console.log(cookie.load('org_obj').org_id);
    this.props.actions.getSurvey(cookie.load('org_obj').org_id);
  }

  componentWillMount(){
    if(this.state.dropDownValue=="drafted"){
      //console.log('data');
    }
      
  }

   componentWillReceiveProps(nextProps){
    this.setState({
      "tableData":nextProps.surveys
    })
    if(nextProps.surveys != undefined){
      if(this.state.modal)
      this.toggle();
    }
  }

  handleChange(e){

          this.setState({
            dropDownValue: e.target.value });

  }

    toggle(data) {
    this.setState({
      modal: !this.state.modal
    });
     if(data != 'edit'){
    this.setState({
      surveyObj: ''
    });
    }
  }

   editSurvey(survey_id){
     const surveyObject=_.find(this.props.surveys, { 'survey_id': parseInt(survey_id) });
     this.setState({'surveyObj':surveyObject});
     const data='edit';
     this.toggle(data);

  }



  render() {
    let tableArray = [];
    if(this.state.tableData && this.state.dropDownValue && this.state.dropDownValue != 'all'){
      let dropValue = this.state.dropDownValue;
      tableArray = _.filter(this.state.tableData, function(obj){
           if(obj.survey_status == dropValue){
            return obj
           }
      });
      
    }else{
      tableArray = this.state.tableData;
    }

    return (

    <Page pageTitle="Surveys" pageAction={<Button size ="sm" color="primary" onClick={this.toggle}>Add New </Button>}>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>Create New Survey</ModalHeader>
        <SurveyCreateForm survey_obj={this.state.surveyObj}  closeAction={this.toggle}/>
      </Modal>
        <Row>
            <Col className = "mb-2" sm = "2" md = {{size: 2}}>
                <Input type="select" name="select" id="exampleSelect" size="sm" value={this.state.dropDownValue} onChange = {this.handleChange}>
                    <option value="all">All</option>
                    <option value="drafted">Draft</option>
                    <option value="started">Active</option>
                    <option value="finished">Finished</option>
                </Input>
            </Col>
        </Row>
        <SurveyTable surveys={tableArray ? tableArray:this.props.surveys} edit={this.editSurvey} />
    </Page>

    )
  }
}


function mapStateToProps(state) {
  return {
    surveys: state.surveys,
    dropDownValue:state.dropDownValue,
    editSurvey:state.editSurvey,
    auth:state.auth
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
)(Surveys);
