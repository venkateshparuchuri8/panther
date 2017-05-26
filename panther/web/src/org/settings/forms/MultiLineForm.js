import React , {Component} from 'react';
import { Label, Input, FormGroup, Row, Col } from 'reactstrap';

class MultiLineForm extends Component {

  render() {
    return(
      <div>
        <Row>
          <Col md="10">
            <FormGroup>
            <Label for="new-field-title">Field Name</Label>
            <Input type="email" name="email" id="exampleEmail" placeholder="" />
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
            <Label for="new-field-title">Max Length</Label>
            <Input type="email" name="email" id="exampleEmail" placeholder="" />
            </FormGroup>
          </Col>
        </Row>
      </div>
      );
  }

}

export default MultiLineForm;
