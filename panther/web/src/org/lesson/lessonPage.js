import React, { PropTypes, Component } from 'react';
import PrimaryNav from '../common/components/PrimaryNav';
import SecondaryNav from '../common/components/SecondaryNav';
//import { Container } from 'reactstrap';
import BreadCrumb from './breadCrumb';
import cookie from 'react-cookie';

class LessonPage extends Component {
  render() {
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <PrimaryNav />
        <SecondaryNav brandName="RWB" brandLogoUrl={brandImage}/>
        <BreadCrumb courseId={this.props.courseId}/>
        <div className="main main-sidebar">
            {this.props.children}
          </div>
      </div>
    );
  }
}

LessonPage.propTypes = {
  children: PropTypes.element
};

export default LessonPage;
