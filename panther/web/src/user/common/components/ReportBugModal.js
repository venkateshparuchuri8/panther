import React,{Component} from 'react';
import {Modal, ModalHeader,ModalBody,ModalFooter,Input,Button} from 'reactstrap';



class ReportBugModal extends Component{
  constructor(props){
    super(props);
    this.state = {
		modal:true,
		bug_description:''
     };
     this.toggle =this.toggle.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.bugDescription =this.bugDescription.bind(this);

  }

  handleChange(e){
	this.setState({
		[e.target.name]: e.target.value
	});
  }
  toggle() {
	const data = '';
    this.props.closeModal(data);
  }
  bugDescription(){
	const description = this.state.bug_description;
	const id = this.props.bugTaskId;
	console.log(description +"||"+id);
	this.props.closeModal(description, id);
  }

  render(){
    return(
	<div>
		{this.props.toggleModal == true ? 
		<Modal isOpen ={true}>
		<ModalHeader toggle={this.toggle}>
		Please tell us below what the problem is:
		</ModalHeader>
        <ModalBody className="">
        <Input type="textarea" className="bug-description" placeholder="Whats wrong?" name="bug_description" id ="bugDescription" value = {this.state.bug_description} onChange = {this.handleChange}/>
        </ModalBody>
        <ModalFooter>
        <Button size="sm" color="primary" onClick={this.bugDescription}>Submit</Button>
        </ModalFooter>
        </Modal>
        :null}
	</div>
    );
  }


}

export default ReportBugModal;