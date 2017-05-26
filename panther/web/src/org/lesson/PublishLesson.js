import React, {Component }  from 'react';
import { Button, ModalBody, ModalHeader,ModalFooter} from 'reactstrap';



class PublishLesson extends Component {
  constructor(props) {
    super(props);
    this.publishClass=this.publishClass.bind(this);
  }
  publishClass(event){
   event.preventDefault();
   this.props.publish(event.target.id);
  }

  render() {
    return (
    <div>
    <ModalHeader toggle={this.props.toggle}>Publish Lesson?</ModalHeader>
    <ModalBody>
      <div><p>Are you sure you want to publish lesson {this.props.lesson_name}</p></div>
    </ModalBody>
    <ModalFooter className={this.props.published ? "hide" : ''}>
    < Button color = "primary" id= {this.props.lesson_id} onClick={this.publishClass}> Publish < /Button>{' '} < Button color = "secondary" onClick={this.props.toggle} > Cancel < /Button>
    </ModalFooter>
    </div>
    );
  }
}

PublishLesson.contextTypes = {
  router: React.PropTypes.object.isRequired
};



export default PublishLesson;
