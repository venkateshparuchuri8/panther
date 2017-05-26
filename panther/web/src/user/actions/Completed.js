import React,{Component} from 'react';
import {Row,Col,Breadcrumb, BreadcrumbItem, FormGroup, Input, Button } from 'reactstrap';
import Isvg from 'react-inlinesvg';

class Completed extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
  }
  render(){
    const actionslist = this.props.actions_list || [];
   return(
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
          <div className="actions-wrapper">
            <div className="actions-wrapper-overlay is-completed">
              <div className="take-action">
                <Isvg src="/assets/icon-check-white.svg"></Isvg>
                <p>{obj.points} XP earned</p>
              </div>
            </div>
            <div className="actions-wrapper-header">
              <div className="actions-wrapper-header-name">05 - Action Time!</div>
              <div className="actions-wrapper-header-actions">
                <span className="report-bug"><Isvg src="/assets/icon-check-bug.svg"></Isvg> Report a bug</span>
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
          </div>
        </Col>
      )}
    </Row>
    );
  }
}
export default Completed;

