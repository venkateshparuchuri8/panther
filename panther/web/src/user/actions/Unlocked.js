import React,{Component, PropTypes} from 'react';
import {Container, Row, Col, Button, FormGroup, Input, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import Isvg from 'react-inlinesvg';
import * as actions from '../actions/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';



class Unlocked extends Component{
  constructor(props){
    super(props);
    this.state = {
      overlay:true
    };
    this.takeAction = this.takeAction.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  takeAction(){
    this.setState({
      overlay:false
    });
  }
  onChange(e){
    e.preventDefault();
    this.setState({
      [e.target.name] : e.target.value
    });
  }
  actionSubmit(obj){
    const actionObj = {};
    actionObj.action_id = obj.action_id;
    actionObj.user_id = obj.user_id;
    actionObj.action_response = this.state.response;
    actionObj.modified_user =obj.user_id;
    console.log(actionObj);
    this.props.actions.updateActions(actionObj);
  }
  render(){
    const actionslist = this.props.actions_list || [];

    return(
    <div>
    <Container fluid={true}>
      <Row>
      {actionslist.map((obj,index) =>
        <Col sm="12" md="6" key={index}>
          <div>
            <Breadcrumb>
              <BreadcrumbItem>{obj.class_name}</BreadcrumbItem>
              <BreadcrumbItem active>{obj.lesson_name}</BreadcrumbItem>
              <BreadcrumbItem>1.5</BreadcrumbItem>
            </Breadcrumb>
          </div>
          {this.state.overlay ? <div className="actions-wrapper">
            <div className="actions-wrapper-overlay">
              <div className="take-action" onClick={this.takeAction}>
                <Isvg src="/assets/icon-actions.svg"></Isvg>
                <p>Take an action</p>
              </div>
            </div>
            <div className="actions-wrapper-header">
              <div className="actions-wrapper-header-name">05 - Action Time!</div>
              <div className="actions-wrapper-header-actions">
                <span className="report-bug"><Isvg src="/assets/icon-report-bug.svg"></Isvg> Report a bug</span>
                <Isvg src="/assets/icon-close.svg"></Isvg>
              </div>
            </div>
            <div className="actions-wrapper-content">
              <div className="actions-wrapper-question">
              {obj.task_description}
              </div>
              <div className="actions-wrapper-answer">
                <FormGroup>
                  <Input type="textarea" placeholder="Reflect on this expirence to complete this action.." />
                </FormGroup>
                <small className="text-danger">Please input at least 100 characters</small>
              </div>
              <div className="actions-wrapper-submit float-right">
                <Button size="sm" color="primary" className="btn-start">
                  <Isvg src="/assets/icon-check-white.svg"></Isvg>Submit
                </Button>
              </div>
            </div>
          </div> :
             <div className="actions-wrapper in-progress">
            <div className="actions-wrapper-header">
              <div className="actions-wrapper-header-name">05 - Action Time!</div>
              <div className="actions-wrapper-header-actions">
                <span className="report-bug"><Isvg src="/assets/icon-report-bug.svg"></Isvg> Report a bug</span>
                <Isvg src="/assets/icon-close.svg"></Isvg>
              </div>
            </div>
            <div className="actions-wrapper-content">
              <div className="actions-wrapper-question">
              {obj.task_description}
              </div>
              <div className="actions-wrapper-answer">
                <FormGroup>
                  <Input type="textarea" name="response" value={this.state.response} placeholder="Reflect on this expirence to complete this action.." onChange={this.onChange} />
                </FormGroup>
                <small className="text-danger">Please input at least 100 characters</small>
              </div>
              <div className="actions-wrapper-submit float-right">
                <Button size="sm" color="primary" className="btn-start" onClick={this.actionSubmit.bind(this,obj)}>
                  <Isvg src="/assets/icon-check-white.svg"></Isvg>Submit
                </Button>
              </div>
            </div>
          </div>}
        </Col>
        )}
      </Row>
    </Container>
    </div>
    );
  }
}
Unlocked.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Unlocked.propTypes = {
 actions: PropTypes.object.isRequired,
 userActions:PropTypes.array
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth:state.auth,
    userActions : state.userActions


  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Unlocked);
