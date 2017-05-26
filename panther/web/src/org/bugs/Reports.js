import React, { Component, PropTypes} from 'react';
import Page from '../common/components/Page';
import { Row, Col, Input} from 'reactstrap';
import ReportsTable from './ReportsTable';
import cookie from 'react-cookie';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../common/actions/index';




class Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dropDownValue:"all"
    }
    this.handleChange = this.handleChange.bind(this);
    this.newBugStat = this.newBugStat.bind(this);
  }

   componentDidMount() {
   this.props.actions.bugReports(cookie.load('org_obj').org_id);
    }

   handleChange(e){
        this.setState({
          dropDownValue: e.target.value });
    }

    newBugStat(status,id){
      console.log("am here nw");
      console.log(status);
      console.log(id);
      const Obj = {};
        Obj.id = id;
        Obj.status = status;
      this.props.actions.updateBugStatus(Obj);
    }

    
	render() {
    return (
    <Page pageTitle="Bug Reports">
      <Row>
        <Col className="mb-2" sm="6" md={{ size: 3}}>
          <Input type="select" name="select" id="exampleSelect" size="sm" value={this.state.dropDownValue} onChange = {this.handleChange}>
            <option value="all">All</option>
            <option value="unresolved">Unresolved</option>
            <option value="inprogress">In Progress</option>
            <option value="resolved">Resolved</option>
          </Input>
        </Col>
      </Row>
      <ReportsTable bugReports={this.props.bugReports} filterBy={this.state.dropDownValue} bugStatusUpdate={this.newBugStat}/>
		</Page>
    );
	}

}

Reports.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Reports.propTypes = {
 actions: PropTypes.object.isRequired,
 bugReports:PropTypes.array
};
function mapStateToProps(state) {
    return {
    auth:state.auth,
    bugReports: state.bugReports

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);

