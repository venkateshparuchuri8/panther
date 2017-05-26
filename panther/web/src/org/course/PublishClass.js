import React, {Component }  from 'react';
import { Button, ModalBody, ModalHeader,ModalFooter} from 'reactstrap';



class PublishClass extends Component {
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
    <ModalHeader toggle={this.props.toggle}>Publish Class?</ModalHeader>
    <ModalBody>
      <div className={this.props.published ? "hide" : ''}>
        <p className="text-center m-5">Are you sure you want to publish class "{this.props.class_name}"</p>
      </div>
    </ModalBody>
      <ModalFooter className={this.props.published ? "hide" : ''}>
      <Button size="lg" color="primary" id= {this.props.class_id} onClick={this.publishClass}> Publish </Button>{' '}
      <Button size="lg" className="btn-cancel" color="cancel" onClick={this.props.toggle}>Cancel</Button>
    </ModalFooter>
    </div>
    );
  }
}

PublishClass.contextTypes = {
  router: React.PropTypes.object.isRequired
};



export default PublishClass;
