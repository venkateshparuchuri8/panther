import React, { Component } from 'react';
import { Button, Input, FormGroup, Label, Form } from 'reactstrap';
import cookie from 'react-cookie';
import toastr from 'toastr';


class NewAction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createAction=this.createAction.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.resetClick = this.resetClick.bind(this);
  }

  handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
  }
  componentWillReceiveProps(props) {
    this.setState({'description':props.description});
  }
  createAction(event){
    event.preventDefault();
    if(parseInt(event.target.getAttribute('data-actions_count')) > 0){
       toastr.warning("You can't create more than one action for a lesson", "Warning");
    }else{
    const actionObj={};
    actionObj.description=this.state.description;
    actionObj.points=100;
    actionObj.created_user=cookie.load('org_obj').user_id;
    actionObj.modified_user=cookie.load('org_obj').user_id;
    if(event.target.id){
      actionObj.id=event.target.id;
    }
    this.props.addNewActionCallback(actionObj);
    }
  }
  resetClick(e){
    e.preventDefault();
    this.setState({'description':''});
  }

  render() {
    return (
    <Form>
    <FormGroup>
      <Label for="description">Action Description</Label>
      <Input type="textarea" id="description" disabled={(this.props.actionsCount > 0 && this.props.formStatusAction != 'edit') ? true : false} name="description" value={this.state.description || this.props.description} onChange={this.handleChange} placeholder="Here will be question" />
    </FormGroup>
    <FormGroup>
      <Label for="exampleEmail">XP: <b>100</b></Label>
    </FormGroup>
    <FormGroup>
    <div className="mt-3 float-right">
        <Button size="lg" color="primary" disabled={(this.props.actionsCount > 0 && this.props.formStatusAction != 'edit')? true : false} data-actions_count={this.props.actionsCount} onClick = {this.createAction} id={this.props.actionId}>{this.props.formStatusAction == 'edit' ? 'Save' : 'Create'}</Button>{' '}
        <Button size="lg" className="btn-cancel" color="cancel" onClick={this.resetClick}>Cancel</Button>{' '}
    </div>
    </FormGroup>
    </Form>
    );
  }
}



export default NewAction;
