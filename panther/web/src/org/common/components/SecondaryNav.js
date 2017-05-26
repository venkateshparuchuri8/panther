import React, { PropTypes, Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/index';
import cookie from 'react-cookie';

class SecondaryNav extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      isOpen: false,
      dropdownOpen: false,
    };

  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }


  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  logOut(e){
    e.preventDefault();
    cookie.remove('org_obj', {path: '/'});
    this.props.actions.orgLogout();
    this.context.router.push('/app/');
  }


  render() {
    const imgUrl = "https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg";
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <Navbar className="secondary-nav" light toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand tag={Link} to="/">
            <img className="brand-logo" src={brandImage} alt={this.props.brandName} />
          </NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                  <DropdownToggle caret>
                    <div className="user-avatar" style={{backgroundImage: `url(${imgUrl})`}} />
                  </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={this.logOut} style={{cursor:'pointer'}}><Link>Logout</Link></DropdownItem>
                </DropdownMenu>
                </Dropdown>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

SecondaryNav.contextTypes = {
  router: React.PropTypes.object.isRequired
};

SecondaryNav.propTypes = {
  brandName:  PropTypes.string,
  brandLogoUrl: PropTypes.string,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
    auth:state.auth,
    userInfoReducer: state.userInfoReducer
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
)(SecondaryNav);
