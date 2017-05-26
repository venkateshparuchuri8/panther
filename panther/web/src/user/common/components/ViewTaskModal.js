import React,{Component} from 'react';
import {ModalHeader} from 'reactstrap';
import ViewMaterial from './ViewMaterial';
import ReportBugModal from './ReportBugModal';
import Isvg from 'react-inlinesvg';



class ViewTaskModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen:false,
      bookmarked:0,
      materialflag:true
     };
    //this.materialflag = this.materialflag.bind(this);
    this.reportBug=this.reportBug.bind(this);
    this.hideModal=this.hideModal.bind(this);
    this.bookmark=this.bookmark.bind(this);
  }
  componentWillMount(){
      this.setState({
        materialflag:this.props.materialObj.material_type == 'Quiz' || this.props.materialObj.material_type == 'Reflection' ? false : true,
        bookmarked :this.props.materialObj.bookmarked
      });
  }
  bookmark(materialObj){
    if(this.state.bookmarked == 1){
      this.setState({bookmarked : 0});
    }else{
      this.setState({bookmarked : 1});
    }
    this.props.bookmarking(materialObj);
  }
 /* materialflag(flag){
    this.setState({materialflag:flag});
  }*/
  reportBug(e){
    console.log(e.target.id);
    this.setState({
      isOpen:true,
      taskId:e.target.id
    });
  }
  hideModal(data,id){
    this.setState({isOpen:false});
    if(data != ''){
    this.props.saveBugReport(data,id);
    }
  }

  render(){
    return(
      <div>
        <ModalHeader tag="div" toggle={this.props.closeModal}>
        <div className="d-flex align-items-center">
        {this.props.materialObj.material_type == 'Quiz' ? <div className="-modal-link quiz-link"></div>:
          <div className="-modal-link">{this.props.materialObj.url}</div>}
          <div className="-modal-actions">
            {(this.props.materialObj.material_type == 'Quiz' || this.props.materialObj.material_type == 'Reflection') ? '' :
            <div className={this.state.bookmarked == 1 ? "bookmark is-active" : "bookmark" } onClick={this.bookmark.bind(this,this.props.materialObj)}>
              <Isvg title="bookmark" src="/assets/icon-bookmark-white.svg"></Isvg>
              <span className="divider"></span>
            </div>}
            <div className="report">
              <Isvg src="/assets/icon-report-bug.svg"></Isvg>
              <span className="text" id={this.props.materialObj.task_id} onClick={this.reportBug}>Report a bug</span>
              <span className="divider"></span>
            </div>
          </div>
        </div>
        </ModalHeader>
        <ViewMaterial completeTaskAction={this.props.completeTaskAction} materialFrom={this.props.materialFrom} materialFlag={this.state.materialflag} materialObj={this.props.materialObj}/>

        <ReportBugModal toggleModal={this.state.isOpen} bugTaskId={this.state.taskId} closeModal={this.hideModal}/>
      </div>
    );
  }
}
export default ViewTaskModal;
