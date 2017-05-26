import React, { PropTypes, Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {Link} from 'react-router';
import toastr from 'toastr';
import Isvg from 'react-inlinesvg';
import cookie from 'react-cookie';
import NotificationsPanel from './NotificationsPanel';
import NotificationBadge from './NotificationBadge';


class SecondaryNav extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toggleNotification = this.toggleNotification.bind(this);

    this.state = {
      isOpen: false,
      dropdownOpen: false,
      isNotificationOpen: false
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
  logOut(){
    cookie.remove('user_obj', {path: '/'});
    toastr.success("Succesfully logged out","Success");
    this.context.router.push('/');
  }

  toggleNotification() {
    this.setState({
      isNotificationOpen: !this.state.isNotificationOpen
    });
  }

 render() {
  let userdata=cookie.load('user_obj');
    return (
      <div>
        <Navbar className="secondary-nav" light toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand tag={Link} to="/">
            <img className="brand-logo" src={this.props.brandLogoUrl} alt={this.props.brandName} />
          </NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                  <DropdownToggle caret className="mr-3">
                    <div className="user-avatar-name">
                      {userdata.name} <br/>
                      <small className="text-muted js-xppoints">{this.props.userPoints.totalPoints} XP</small>
                    </div>
                    <div className="user-avatar" style={{backgroundImage: `url(${userdata.profile_pic})`}}></div>
                  </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><Link to="/user/settings"><Isvg src="/assets/icon-settings.svg"></Isvg>Profile Settings</Link></DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem><Link onClick={this.logOut}><Isvg src="/assets/icon-next-white.svg"></Isvg>Logout</Link></DropdownItem>
                </DropdownMenu>
                </Dropdown>
              </NavItem>
              <NavItem onClick={this.toggleNotification} className="d-flex align-items-center notification-icon">
              {this.props.notificationlist && this.props.notificationlist.unreaded_notifications_count > 0 ? <img src="/assets/notification-bar.svg"/> : <img src="/assets/notification-bar-default.svg"/> }
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        {this.state.isNotificationOpen ? <NotificationsPanel readedNotification={this.props.readedNotification} notificationlist={this.props.notificationlist} close={this.toggleNotification}/> : ''}

        <div className="notification-corner">
          {this.props.notification && this.props.notification.organization_id ?
            <NotificationBadge notification={this.props.notification}/>
            : ''
          }
        </div>

      </div>
    );
  }
}

SecondaryNav.contextTypes = {
  router: React.PropTypes.object.isRequired
};

SecondaryNav.propTypes = {
  brandName:  PropTypes.string,
  brandLogoUrl: PropTypes.string
};

export default SecondaryNav;
