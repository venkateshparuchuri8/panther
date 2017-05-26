import React from 'react';
import { Container, Row, Col, Button} from 'reactstrap';
import BodyClassName from 'react-body-classname';

const LandingPage = (props) => {
    let styles = {};
    if(props.orgData && props.orgData.image_url) styles = {backgroundImage: `url(${props.orgData.image_url})`};
    console.log(styles);
    return (
      <BodyClassName className="-landingpage">
        <div className="landingpage-inner" style={styles}>
          <Container>
            <Row className="justify-content-center">
              <Col md="12">
                <div dangerouslySetInnerHTML={{
                  __html: props.orgData ? props.orgData.content : '<h1>Panther Learning Management System</h1>'
                }} />
                <section className="mb-3">
                  {props.loading ? <p>Fetching user data... <br /><img src="../assets/icon-loading.svg"/></p> : <Button size="sm" color="primary" onClick={props.onClick}>{props.orgData ? props.orgData.button : 'Start Here'}</Button>}
                </section>
              </Col>
            </Row>
          </Container>
        </div>
      </BodyClassName>
    );
}


export default LandingPage;
