import React,{Component,PropTypes} from 'react';
import Page from '../common/components/Page';
import {Tabs,Tab,TabList,TabPanel} from 'react-tabs';
import {Row, Col} from 'reactstrap';
import * as actions from '../actions/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Unlocked from './Unlocked';
import Completed from './Completed';
import LearnMore from './LearnMore';
import _ from 'underscore';
import cookie from 'react-cookie';

class Actions extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.props.actions.getAllUserActions(cookie.load('user_obj').user_id);
  }
  render(){
    const userCompletedActions = _.filter(this.props.userActions,function(obj){
      return obj.status == 'completed';
    });
    const userActions =_.filter(this.props.userActions,function(obj){
      return obj.status == 'started';
    });
     return(
      <Page
       pageTitle="Your Actions"
      pageDescription="Use your developed skills in the real world."
      pageDescriptionAction={<LearnMore/>}>
      <div className="course-page-body">
        {this.props.userActions ? <Tabs>
            <TabList>
              <Tab>Unlocked</Tab>
              <Tab>Completed</Tab>
            </TabList>
            <TabPanel>
            {userActions.length > 0 ?<Unlocked actions_list={userActions}/> :
            <div>
              <Row>
                <Col md="12">
                  <h4 className="text-center mt-10">Sorry, you have not unlocked any Actions yet. Complete Lessons to unlock them!</h4>
                </Col>
              </Row>
            </div>}
            </TabPanel>
            <TabPanel>
              {userCompletedActions.length > 0 ? <Completed actions_list={userCompletedActions}/>: <div>
              <Row>
                <Col md="12">
                  <h4 className="text-center mt-10">Sorry, you have not unlocked any Actions yet. Complete Lessons to unlock them!</h4>
                </Col>
              </Row>
            </div>}
            </TabPanel>
          </Tabs> :
          <div>
              <Row>
                <Col md="12">
                  <h4 className="text-center mt-10">Sorry, you have not unlocked any Actions yet. Complete Lessons to unlock them!</h4>
                </Col>
              </Row>
            </div>}
      </div>
      </Page>
    );
  }
}

Actions.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Actions.propTypes = {
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
)(Actions);
