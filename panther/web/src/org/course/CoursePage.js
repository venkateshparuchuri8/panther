import React, {Component } from 'react';
import PrimaryNav from '../common/components/PrimaryNav';
import SecondaryNav from '../common/components/SecondaryNav';
import BreadCrumb from './BreadCrumb';
import cookie from 'react-cookie';

class CoursePage extends Component {
  render() {
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <PrimaryNav />
        <SecondaryNav brandName="RWB" brandLogoUrl={brandImage}/>
        <BreadCrumb />
          <div className="main main-sidebar">
            {this.props.children}
          </div>
      </div>
    );
  }
}

// CoursePage.propTypes = {
//   children: PropTypes.element
// };

export default CoursePage;
