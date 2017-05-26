import React,{Component} from 'react';
import {Button , FormGroup , Input} from 'reactstrap';
import Isvg from 'react-inlinesvg';
import * as actions from './actions/index';
import cookie from 'react-cookie';



class Reflection extends Component{
  constructor(props){
    super(props);
    this.state = {
      materialflag:true
    };
    this.onChange = this.onChange.bind(this);
    this.submitReflection = this.submitReflection.bind(this);
  }

  onChange(e){
    e.preventDefault();
    this.setState({[e.target.name] : e.target.value});
  }
  submitReflection(e){
    e.preventDefault();
    const obj={};
    obj.response = this.state.response;
    obj.user_id = cookie.load('user_obj').user_id;
    obj.reflection_id = this.props.materialobj.reflection_id;
    let data=this;
    actions.reflection(obj).done((response) => {
      if(response.result) {
        data.setState({materialflag : false});
        data.props.materialflag(true);
      }
    });

  }
  render(){
    return(
      <div>
        <div className="actions-wrapper in-progress">
            {this.state.materialflag ?
            <div className="actions-wrapper-content">
              <div className="actions-wrapper-question">
              {this.props.materialobj.reflection_question}
              </div>
              <div className="actions-wrapper-answer">
                <FormGroup>
                  <Input type="textarea" name="response" value={this.state.response} placeholder="Reflect on this expirence to complete this action.." onChange={this.onChange} />
                </FormGroup>
                <small className="text-danger">Please input at least 100 characters</small>
              </div>
              <div className="actions-wrapper-submit float-right">
                <Button size="sm" color="primary" className="btn-start" disabled={!this.state.response || this.state.response.length<100} onClick={this.submitReflection}>
                  <Isvg src="/assets/icon-check-white.svg" />Submit
                </Button>
              </div>
            </div>:
             <div className="actions-wrapper-note">
              <h3>Congratulations!</h3>
              Youve Succesfully Submitted this task.
              </div>}
          </div>
      </div>
    );
  }
}
export default Reflection;
