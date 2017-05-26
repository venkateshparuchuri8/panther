import React,{Component} from 'react';
import {Button,Modal, ModalBody, Row, Col} from 'reactstrap';
import Isvg from 'react-inlinesvg';

class LearnMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return(
      <span className="ml-1 a-link" onClick={this.toggle}>
        Learn more
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalBody>
            <div className="m-5">
              <div className="text-center mb-5 svg-fill-primary">
                <Isvg src="/assets/icon-actions.svg"></Isvg>
              </div>
              <Row>
                <Col md="10" className="mx-auto mb-5">
                  <p>You can view and take unlocked Actions here or under the corrosponding classes in the classroom. Actions encourage you to apply the knowledge you've learned here in real world.</p>
                </Col>
              </Row>

              <Row>
                <Col md="2" className="mx-auto">
                  <div className="text-center">
                    <Button size="sm" onClick={this.toggle} color="primary" className="btn-start">
                    <Isvg src="/assets/icon-check-white.svg"></Isvg>Got it</Button>
                  </div>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </span>
    );
  }
}

export default LearnMore;
