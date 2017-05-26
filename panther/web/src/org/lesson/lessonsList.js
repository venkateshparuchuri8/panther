import React, {Component,PropTypes }  from 'react';
import { Modal} from 'reactstrap';
import PublishLesson from './PublishLesson';



class LessonsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggle = this.toggle.bind(this);
    this.editLesson=this.editLesson.bind(this);
    this.itemsPage=this.itemsPage.bind(this);
  }

  itemsPage(event){
    event.preventDefault();
    this.props.taskPage(event.target.id);
  }

  toggle(event) {
    this.setState({lesson_id: event.target.id,lesson_name:event.target.name});
    this.setState({
      modal: !this.state.modal
    });
  }

  editLesson(event){
    event.preventDefault();
    this.props.editLessonPage(event.target.id, event.target.getAttribute('data-status'));
  }

  render() {
    //const draftedLessons=this.props.lessons.draftedLessons || [];
    //const publishedLessons=this.props.lessons.publishedLessons || [];
    let lessonsLIst=[];
    {this.props.lessons && this.props.lessons.length > 0 ? lessonsLIst=this.props.lessons : lessonsLIst=[]}
    return (
      <div>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <PublishLesson lesson_id={this.state.lesson_id} lesson_name={this.state.lesson_name} toggle={this.toggle} publish={this.props.publish} published={this.props.published}/>
      </Modal>
    {/*<ul className="course-list">
      {draftedLessons.map(lass =>
         <li key={lass.id}>
        <a href="">{lass.name}</a>
        <a id={lass.id} onClick={this.itemsPage} className="course-list-icon"><img alt="classes" id={lass.id} title="Task" className="arrow-icon" src={window.location.origin+"/assets/icon-arrow-right.svg"}/></a>
        <a id={lass.id} data-status="drafted" className="course-list-icon" onClick={this.editLesson}><img alt="edit" title="Edit" id={lass.id} data-status="drafted" src={window.location.origin+"/assets/icon-edit.svg"}/></a>
        <a id={lass.id} name={lass.name}  onClick={this.toggle} className="course-list-icon"><img id={lass.id} name={lass.name} alt="publish" title="Publish" src={window.location.origin+"/assets/icon-publish.svg"}/></a>
      </li>
     )}

    </ul>*/}
    <ul className="course-list">
      {lessonsLIst.map(lass =>
         <li key={lass.lesson_id}>
        <a >{lass.name}</a>
        <div>
          <a id={lass.id} data-status="published" onClick={this.editLesson} className="course-list-icon"><img alt="edit" title="Edit" id={lass.id} data-status="published" src={window.location.origin+"/assets/icon-edit.svg"}/></a>
          <a id={lass.id} onClick={this.itemsPage} className="course-list-icon"><img alt="classes" id={lass.id} title="Task" className="arrow-icon" src={window.location.origin+"/assets/icon-arrow-right.svg"}/></a>
        </div>
      </li>
     )}

    </ul>
    </div>
    );
  }
}

LessonsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

LessonsList.propTypes = {
 auth: PropTypes.object,
 lessons:PropTypes.array
};


export default LessonsList;
