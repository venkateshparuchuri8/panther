  import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SurveyCreateForm from './surveyCreateForm';
import * as actions from '../common/actions/index';
import cookie from 'react-cookie';
var _ = require('lodash')

class SurveyTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalStartOpen:false,
      isModalEditOpen:false,
      isModalDeleteOpen:false,
      gotItmodal:false
    };

    this.toggleStart = this.toggleStart.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.onAction=this.onAction.bind(this);
    this.startSurvey=this.startSurvey.bind(this);
    this.deleteSurvey=this.deleteSurvey.bind(this);
    this.editSurvey=this.editSurvey.bind(this);
    this.toggleConfirm=this.toggleConfirm.bind(this);


  }


  onAction(event){
  event.preventDefault();
    const surveyId = event.target.id;
    const Surveystat = event.target.name;
    const currentStatus = event.target.getAttribute('data-tag');
    const surveyName = event.target.getAttribute('data-name');

    let modalStart, modalEdit, modalDel, modalText, allowStart;

   if(Surveystat == "draftedStart" || Surveystat == "startedStart"){
        modalStart =  !this.state.isModalStartOpen;

        if(Surveystat=="draftedStart"){
             modalText = "Start";
              let surveyStartCheck = _.find(this.props.surveys, {survey_status: 'started'});
             //console.log(surveyStartCheck);
             if(surveyStartCheck == undefined){
              allowStart = true;
            }
            else if(surveyStartCheck != undefined){
              allowStart = false;
            }

        }else if(Surveystat == "startedStart"){
           allowStart = true;
           modalText = "Stop";
        }
   }
   if(Surveystat == "startedEdit" || Surveystat == "draftedEdit"){
        modalEdit =  !this.state.isModalEditOpen ;
        this.editSurvey(surveyId);
   }
   if(Surveystat ==  "startedDelete"){
        modalDel =  !this.state.isModalDeleteOpen ;
   }

    this.setState({
      isModalStartOpen: modalStart,
      isModalEditOpen: modalEdit,
      isModalDeleteOpen: modalDel,
      surveyId: surveyId,
      currentStatus:currentStatus,
      currentSurveyStat:Surveystat,
      surveyName:surveyName,
      allowStart:allowStart,
      modalText:modalText
    });

  }

   toggleStart() {
    this.setState({
      isModalStartOpen: !this.state.isModalStartOpen
    });
  }

     toggleEdit() {
    this.setState({
      isModalEditOpen: !this.state.isModalEditOpen
    });
  }

     toggleDelete() {
    this.setState({
      isModalDeleteOpen: !this.state.isModalDeleteOpen
    });
  }

       toggleConfirm() {
    this.setState({
      gotItmodal: !this.state.gotItmodal
    });
  }

   startSurvey(event){

  event.preventDefault();
    let updatedStatus, gotItText;
    if(this.state.currentStatus == 'drafted'){
      updatedStatus= 'started';
      gotItText= "Survey has been started!";
    }
    if(this.state.currentStatus == 'started'){
      updatedStatus='finished';
      gotItText= "Survey has been stopped!";
    }
    const obj={};
    obj.survey_id = this.state.surveyId;
    obj.user_id = cookie.load('org_obj').user_id;
    obj.survey_status = updatedStatus;

    if(this.state.allowStart){
    this.props.actions.surveyStatusUpdate(obj);
    }
    this.setState({
      isModalStartOpen: !this.state.isModalStartOpen,
      gotItmodal:!this.state.gotItmodal,
      "gotItText":gotItText
    });
 }

  deleteSurvey(event){
    event.preventDefault();
    const obj={};
    obj.survey_id = this.state.surveyId;
    this.props.actions.surveyDelete(obj);
     this.setState({
        isModalDeleteOpen: !this.state.isModalDeleteOpen,
        gotItmodal:!this.state.gotItmodal,
        "gotItText":"Survey has been deleted."
      });
 }

  editSurvey(id){
    this.props.edit(id);
 }




  render() {

    const columns = [
      {
        header: '',
        accessor: 'id',
        maxWidth: 10,
        sortable: false
      },
      {
        header: 'Name of Survey',
        accessor: 'survey_name'
      },
      {

        header: 'Status',
        accessor: 'survey_status',

        render:(object)=> {
          if(object.row.survey_status == "started"){
            return <div style={{color: '#14C578'}}>Active</div>
          }
          if(object.row.survey_status == "drafted"){
            return <div style={{color: '#63666A'}}>Draft</div>
          }
          if(object.row.survey_status == "finished"){
            return <div style={{color: '#BF0d3E'}}>Finished</div>
          }
        }
      },
      {
        header: 'Launched',
        accessor: 'launch_date'
      },
      {
        header: 'Stopped',
        accessor: 'stopped_date'
      },

       {
        header: 'Actions',
        id: 'id',
        render: (object) => {
            if(object.rowValues.survey_status =='drafted'){
            return <div><span  className="mr-3"><img size ="sm" id={object.row.survey_id} name="draftedStart" title="Start survey" data-tag={object.row.survey_status} data-name= {object.row.survey_name} style={{cursor:'pointer'}} onClick={this.onAction} src="/assets/icon-play.svg"/></span>
             {' '}<span  className="mr-2"><img size ="sm" id={object.row.survey_id} title="Edit survey" name="draftedEdit" style={{cursor:'pointer'}} onClick={this.onAction}src="/assets/icon-edit.svg"/></span>
             {' '}<span  className="mr-3"><img size ="sm" id={object.row.survey_id} title="Delete survey" name="startedDelete" style={{cursor:'pointer'}} onClick={this.onAction}src="/assets/icon-delete.svg"/></span></div> ;
          }
          if(object.rowValues.survey_status =='started'){
            return <div><span className="mr-3"><img size ="sm" id={object.row.survey_id} name="startedStart" title="Stop survey" data-tag={object.row.survey_status} data-name= {object.row.survey_name} style={{cursor:'pointer'}} onClick={this.onAction} src="/assets/icon-stop.svg"/></span>
            {' '}<span className="mr-2"><img size ="sm" id={object.row.survey_id} name="startedDelete"  src="/assets/icon-disableDel.svg"/></span> 
            {' '}<span className="mr-3"><img size ="sm" id={object.row.survey_id} name="startedEdit" src="/assets/icon-disableEdit.svg"/></span></div> ;
          }
          if(object.rowValues.survey_status =='finished'){
            return <div><img size ="sm" id={object.row.survey_id} title="Delete survey" name="startedDelete" style={{cursor:'pointer'}} onClick={this.onAction}src="/assets/icon-delete.svg"/></div> ;
          }

        },
        width: 80,
        style: {textAlign: 'right'}
      }
    ];

    return (
      <div>

        <ReactTable className="-highlight" data={this.props.surveys} columns={columns} defaultPageSize={9} showPagination={this.props.surveys.length > 9 ? true : false}/> 


           {this.state.isModalStartOpen ?
              <Modal isOpen={this.state.isModalStartOpen} toggle={this.toggleStart}>
                <ModalHeader toggle={this.toggleStart}> {this.state.modalText} Survey?</ModalHeader>
                <ModalBody>
                  <div>
                    <p className="text-center m-5"> Are you sure want to {this.state.modalText} survey{' '}{this.state.surveyName}?</p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button size="lg" color="primary" id={this.state.surveyId} name={this.state.currentSurveyStat} onClick = {this.startSurvey}> {this.state.modalText} </Button>{' '}
                  <Button size="lg" color="cancel" onClick={this.toggleStart}> Cancel </Button>
                </ModalFooter>
              </Modal>
           :null
        }

          {this.state.isModalEditOpen ?

              <Modal isOpen={false} toggle={this.toggleEdit}>
                          <SurveyCreateForm />
                          </Modal>

               :null
          }

          {this.state.isModalDeleteOpen ?
              <Modal isOpen={this.state.isModalDeleteOpen} toggle={this.toggleDelete}>
                  <ModalHeader toggle={this.toggleDelete}>Delete Survey{' '}{this.state.surveyName}?</ModalHeader>
                  <ModalBody>
                    <div><p className="text-center m-5"> Are you sure want to delete the survey{' '}{this.state.surveyName} ?</p></div>
                  </ModalBody>
                  <ModalFooter>
                    <Button size="sm" color = "primary" id={this.state.surveyId} name={this.state.currentSurveyStat} onClick={this.deleteSurvey}> Delete </Button>{' '}
                    <Button size="sm" color = "cancel" onClick={this.toggleDelete}> Cancel </Button>
                  </ModalFooter>

              </Modal>
           :null
        }
        {this.state.gotItmodal ?
          <Modal isOpen={this.state.gotItmodal}>
            <ModalBody>
            <div>
              {this.state.currentSurveyStat =="draftedStart" && !this.state.allowStart ?
              <ModalHeader toggle={this.toggleConfirm}>Error</ModalHeader>
              :null
              }
            </div>
            {this.state.allowStart  ?
               <div className="text-center m-7">
               <h6 className="text-center mb-5">{this.state.gotItText}</h6>
                <Button className="text-center" size="lg" color = "primary" onClick = {this.toggleConfirm}> Got It! </Button>
              </div>
              :
              <div>
                {this.state.currentSurveyStat =="draftedStart" ?
                    <div><p className="text-center m-5">Survey cannot be started as there's another active survey running.</p>
                    <div>
            <ModalFooter>
              <Button size="lg" color = "primary" onClick = {this.toggleConfirm}> Got It! </Button>
              <Button size="lg" color = "cancel" onClick={this.toggleConfirm}> Cancel </Button>
              </ModalFooter>

                </div>
              </div>
              :
              <div className="text-center m-7">
              <h6 className="text-center mb-5">{this.state.gotItText}</h6>
              <Button className="text-center" size="lg" color = "primary" onClick = {this.toggleConfirm}> Got It! </Button>
              </div>



              }
              </div>

            }

              </ModalBody>
              </Modal>

          :null
        }
      </div>
    )
  }
}


SurveyTable.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  console.log(state);
  return {
      //surveysobj:state.surveys
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(SurveyTable);
