import React, { PropTypes, Component } from 'react';
import PrimaryNav from './PrimaryNav';
import SecondaryNav from './SecondaryNav';
import { Container } from 'reactstrap';
import cookie from 'react-cookie';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Page extends Component {
  render() {
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <PrimaryNav />
        <SecondaryNav brandName="RWB" brandLogoUrl={brandImage}/>
        <div className="main">
          <Container fluid={true} className="main-inner">
            <div className="main-page-header">
              <h1 className="main-page-title">{this.props.pageTitle}</h1>
              {this.props.pageAction}
            </div>
            <p className="main-page-description">{this.props.pageDescription}</p>
          </Container>
          <Container fluid={true} className="main-inner">
            {this.props.children}
          </Container>
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node,
  pageAction: PropTypes.element,
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string
};

export default Page;
