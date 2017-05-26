import React, {Component}  from 'react';
import { Modal, ModalBody, Button} from 'reactstrap';
import PublishClass from './PublishClass';
class ClassList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modal1:false,
      nolessonsmessage:''
    };
    this.toggle = this.toggle.bind(this);
    this.publishClass=this.publishClass.bind(this);
    this.lession=this.lession.bind(this);
    this.editClass=this.editClass.bind(this);
    this.toggle1=this.toggle1.bind(this);
    this.publishClassEvent=this.publishClassEvent.bind(this);
  }
  publishClass (event) {
    event.preventDefault();
    this.props.publishClass(event.target.parentElement.id,this.props.params.id);
  }
  editClass(event){
    event.preventDefault();
    this.props.editClassPage(event.target.id,event.target.getAttribute('data-status'));
  }
  lession(event){
    event.preventDefault();
    this.props.lessonPage(event.target.id);
  }
  publishClassEvent(event){
    event.preventDefault();
    if(parseInt(event.target.getAttribute('data-lessoncount')) > 0){
      this.setState({'nolessonsmessage':''});
    this.toggle(event);
  }else{
     this.setState({'nolessonsmessage':'no lessons'});
     this.toggle1();
  }
  }
  toggle(event) {
    if(event){
      event.preventDefault();
    this.setState({class_id: event.target.parentElement.id,class_name:event.target.parentElement.name});
    }
    this.setState({
      modal: !this.state.modal
    });
  }
  toggle1() {
    this.setState({
      modal1: !this.state.modal1
    });
  }
  componentWillReceiveProps(props){
    if(props.published && this.state.modal == true && this.state.modal1 == false){
      this.toggle();
      this.toggle1();
      
    }
  }
  render() {
    const draftedClasses=this.props.classes.draftedClasses || [];
    const publishedClasses=this.props.classes.publishedClasses || [];
    return (
      <div>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <PublishClass class_id={this.state.class_id} class_name={this.state.class_name} toggle={this.toggle} publish={this.props.publish} published={this.props.published}/>
      </Modal>
      <Modal isOpen={this.state.modal1} toggle={this.toggle1} className={this.props.className}>
        <ModalBody>
        {this.state.nolessonsmessage == 'no lessons'?
        <div className="text-center m-7">
               <h6 className="text-center mb-5">This class cannot be published as there are no lessons available.</h6>
                <Button size="lg" color = "primary" className="text-center" onClick={this.toggle1} > Got it! </Button></div>
        :
        <div className="text-center m-7">
               <h6 className="text-center mb-5">{this.state.class_name} has been published.</h6>
                <Button size="lg" color = "primary" className="text-center" onClick={this.toggle1} > Got it! </Button></div>
}
      
    </ModalBody>
      </Modal>
    <ul className="course-list">
      <label>Drafts ({draftedClasses.length})</label>
      {draftedClasses.map(lass =>
         (<li key={lass.id}>
        <a >{lass.name}</a>
        <div>
          <a id={lass.id} name={lass.name} data-lessoncount={lass.lesson_count} data-taskcount={lass.task_count} data-actioncount={lass.action_count}  onClick={this.publishClassEvent} className="course-list-icon"><img id={lass.id} name={lass.name} data-lessoncount={lass.lesson_count} data-taskcount={lass.task_count} data-actioncount={lass.action_count} alt="publish" title="Publish" src={window.location.origin+"/assets/icon-publish.svg"}/></a>
          <a id={lass.id} data-status="drafted" className="course-list-icon" onClick={this.editClass} ><img alt="edit" title="Edit" id={lass.id} data-status="drafted" src={window.location.origin+"/assets/icon-edit.svg"}/></a>
          <a id={lass.id} onClick={this.lession} className="course-list-icon"><img id={lass.id} alt="classes" title="Lesson" className="arrow-icon" src={window.location.origin+"/assets/icon-arrow-right.svg"}/></a>
        </div>        
      </li>)
     )}
    </ul>
    <ul className="course-list">
      <label className="published">Published ({publishedClasses.length})</label>
      {publishedClasses.map(lass =>
         <li key={lass.id}>
        <a >{lass.name}</a>
        <div>
          <a id={lass.id}  data-status="published" className="course-list-icon" onClick={this.editClass} ><img alt="edit" id={lass.id} data-status="published" title="Edit" src={window.location.origin+"/assets/icon-edit.svg"}/></a>
          <a id={lass.id} onClick={this.lession}  className="course-list-icon"><img alt="classes" id={lass.id} title="Lesson" className="arrow-icon" src={window.location.origin+"/assets/icon-arrow-right.svg"}/></a>
        </div>
      </li>
     )}
    </ul>
    </div>
    );
  }
}
ClassList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default ClassList;
