import React,{Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import Page from './common/components/Page';
//import { Route, Link, IndexLink } from 'react-router';
//import { Button , Form, FormGroup , Label,Col, Row , Container, Input} from 'reactstrap';
//import HomeNav from './HomeNav';
import * as actions from './common/actions/index';
import cookie from 'react-cookie';
import AuthService from './authService';
import LandingPage from './landingpage/LandingPage';


class UserSignIn extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orgDetails: {}
    };
    this.onSubmit=this.onSubmit.bind(this);
    this.auth = undefined;
  }
  componentWillMount(){
    if(cookie.load('user_obj')){
      this.context.router.push('/user/dashboard');
    }
    actions.getOrgDetails(window.location.origin).done((response) => {
      this.setState({
        orgDetails: response.result
      });
      if(response.result.primary_color) {
        const secondary_color = response.result.secondary_color ? response.result.secondary_color : undefined;
        actions.setThemeColor(response.result.primary_color, secondary_color);
      }
      cookie.save('org_details', response.result, {path: '/'});
      this.auth = new AuthService({
        clientId: response.result.auth0clientid,
        domain: response.result.auth0domain,
        title: response.result.organization_name,
        logo: response.result.logo_url
      });
      this.auth.on('fetching_user', (state) => {
        this.setState({loading: state});
      });
    });

  }

  onSubmit (event) {
    event.preventDefault();
    this.setState({loading: true});
    const email=event.target.email.value;
    const password=event.target.password.value;
    const obj={
      'email':email,
      'password':password
    };
    cookie.save('user_obj', obj, { path: '/' });
    this.props.actions.saveUserLoginDataToStore(obj);
    this.context.router.push('/user/dashboard');
    // actions.orgLogin(obj).done((response) => {
    //   this.setState({loading: false});
    //   this.props.actions.saveLoginDataToStore(response.result);
    //   cookie.save('org_obj', response.result, { path: '/' });
    //   this.context.router.push('/app/dashboard');
    // });
  }
  render(){
    return(
		<div>
      <LandingPage orgData={this.state.orgDetails} onClick={() => this.auth.login()} loading={this.state.loading}/>
    </div>
		);
	}
}

UserSignIn.contextTypes = {
  router: React.PropTypes.object.isRequired
};

UserSignIn.propTypes = {
 userAuth: PropTypes.object,
 actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    userAuth: state.userAuth
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
)(UserSignIn);
