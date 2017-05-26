import React , {Component} from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';

class MultiCheckBoxForm extends Component{
  render(){
    return(
      <div>
      <FormGroup>
        <Label for="new-field-title">Title</Label>
        <Input type="text" name="title" id="title" placeholder="" />
      </FormGroup>
      <FormGroup>
        <Label for="new-field-title">Checkbox #1</Label>
        <Input type="text" name="checkbox1" id="checkbox1" placeholder="" />
      </FormGroup>
      <FormGroup>
        <Label for="new-field-title">Checkbox #2</Label>
        <Input type="text" name="checkbox2" id="checkbox2" placeholder="" />
      </FormGroup>
      <FormGroup>
      <Button outline> + Add</Button>
      </FormGroup>
      </div>
      );
  }
}
export default MultiCheckBoxForm;
