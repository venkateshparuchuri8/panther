import React, { PropTypes, Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/index';
import cookie from 'react-cookie';
import MobilePage from '../../../org/common/components/MobilePage';

class userApp extends Component {
  componentWillMount() {
    if(cookie.load('org_details')) {
      const {primary_color, secondary_color} = cookie.load('org_details');
      actions.setThemeColor(primary_color, secondary_color);
    }
  }
  render() {
  // let children = null;
  //   if (this.props.children) {
  //     children = React.cloneElement(this.props.children, {
  //       auth: this.props.route.auth //sends auth instance from route to children
  //     })
  //   }
    return (
      <div>
        <div>
         {window.innerWidth > 520 ? <div>{this.props.children}</div> : <MobilePage/>}
        </div>
      </div>
    );
  }
}

userApp.propTypes = {
  children: PropTypes.element,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
    userAuth: state.userAuth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(userApp);

