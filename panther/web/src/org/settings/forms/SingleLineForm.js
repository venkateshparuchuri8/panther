import React , {Component} from 'react';
import { Label, Input, FormGroup } from 'reactstrap';

class SingleLineForm extends Component {

  render() {
    return(
      <FormGroup>
        <Label for="new-field-title">Title</Label>
        <Input type="email" name="email" id="exampleEmail" placeholder="" />
      </FormGroup>
      );
  }

}

export default SingleLineForm;
