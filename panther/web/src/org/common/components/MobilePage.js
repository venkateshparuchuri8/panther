import React, { Component } from 'react';
//import PrimaryNav from './PrimaryNav';
//import SecondaryNav from './SecondaryNav';
import { Container, Row, Col } from 'reactstrap';
import cookie from 'react-cookie';

class MobilePage extends Component {
  render() {
    const brandImage = cookie.load('org_details').logo_url || "/assets/brand-logo.svg";
    return (
      <div>
        <Container>
          <Row>
            <Col className="mx-auto text-center mt-5">
              <img className="w-25 mb-5" src={brandImage}/>
            </Col>
          </Row>
          <Row>
            <Col className="mx-auto text-center" sm="6">
              <p>Sorry, this page cannot be accessed from mobile devices.</p>
              <p>Please come back from tablet or desktop.</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}


export default MobilePage;
