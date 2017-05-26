import React,{Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import Page from './common/components/Page';
//import { Route, Link, IndexLink } from 'react-router';
import { Button , Form, FormGroup , Label,Col, Row , Container, Input} from 'reactstrap';
//import HomeNav from './HomeNav';
import * as actions from './common/actions/index';
import cookie from 'react-cookie';
import * as userActions from '../user/common/actions/index';



class SignIn extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.onSubmit=this.onSubmit.bind(this);
  }
  componentWillMount(){
    if(cookie.load('org_obj')){
      this.context.router.push('/app/dashboard');
    }
    userActions.getOrgDetails(window.location.origin).done((response) => {
      if(response.result.primary_color) {
        const secondary_color = response.result.secondary_color ? response.result.secondary_color : undefined;
        userActions.setThemeColor(response.result.primary_color, secondary_color);
      }
      cookie.save('org_details', response.result, {path: '/'});
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
    actions.orgLogin(obj).done((response) => {
      this.setState({loading: false});
      this.props.actions.saveLoginDataToStore(response.result);
      cookie.save('org_obj', response.result, { path: '/' });
      this.context.router.push('/app/dashboard');
    });
  }
  render(){
    return(
		<div>
      <Container>
        <Row>
        <Col sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
          <h4 className="mb-3">Sign In</h4>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="exampleEmail" > Email </Label>
              <Input type="email" name="email" id="email" placeholder="sample@mail.com" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail2"> Password </Label>
              <Input type="password" name="password" id="password" placeholder="********" />
            </FormGroup>
            <Button size="lg" color="primary" type="submit" disabled={this.state.loading}>Sign in</Button>
          </Form>
        </Col>
      </Row>
      <Row className={this.state.loading ? '' : 'hide'}>
        <Col sm={{size: 4, push: 3, pull: 2, offset: 1}} className="mt-5">
          <img src="../assets/icon-loading.svg"/>
        </Col>
      </Row>
      </Container>
    </div>

		);
	}
}

SignIn.contextTypes = {
  router: React.PropTypes.object.isRequired
};

SignIn.propTypes = {
 auth: PropTypes.object,
 actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
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
)(SignIn);
