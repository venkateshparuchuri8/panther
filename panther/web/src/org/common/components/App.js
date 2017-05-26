import React, { PropTypes, Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/index';
import cookie from 'react-cookie';
import MobilePage from './MobilePage';
import * as userActions from '../../../user/common/actions/index';

class App extends Component {
  componentWillMount(){
    if(cookie.load('org_obj')){
      this.props.actions.saveLoginDataToStore(cookie.load('org_obj'));
    }
    if(cookie.load('org_details')) {
      const {primary_color, secondary_color} = cookie.load('org_details');
      userActions.setThemeColor(primary_color, secondary_color);
    }
  }
  render() {
    return (
      <div>
        <div>
         {window.innerWidth > 520 ? this.props.children : <MobilePage/>}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
    auth:state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

