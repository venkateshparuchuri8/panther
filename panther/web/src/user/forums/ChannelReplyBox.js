import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import Isvg from 'react-inlinesvg';

class ChannelReplyBox extends Component {
  render() {
    return (
      <div>
        <div className="channel-reply-box animated bounceInUp">
          <Row>
            <Col md="6" className="mx-auto">
              <div>
                <h5>Hi, this is a reply box</h5>
                <Button onClick={this.props.toggle}><Isvg src="/assets/reply-arrow-down.svg"></Isvg></Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default ChannelReplyBox;
