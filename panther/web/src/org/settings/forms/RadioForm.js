import React , {Component} from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';

class RadioForm extends Component{

  constructor(props) {
    super(props);

    this.state = {
      radioList: []
    };

    this.addRadioForm = this.addRadioForm.bind(this);
  }

  addRadioForm(e) {
    e.preventDefault();

    const radioList = this.state.radioList;

    this.setState({
      radioList: radioList.concat(<FormGroup>
      <Label key={radioList.length} for="new-field-title">Radio Button #{radioList.length}</Label>
      <Input type="text" name="radio2" />
      </FormGroup>)
    });
  }

  render(){
    return(
      <div>
      <FormGroup>
        <Label for="new-field-title">Title</Label>
        <Input type="text" name="title" id="title" placeholder="" />
      </FormGroup>
      <FormGroup>
        <Label for="new-field-title">Radio Button #1</Label>
        <Input type="text" name="radio1" id="radio1" placeholder="" />
      </FormGroup>
      <FormGroup>
        <Label for="new-field-title">Radio Button #2</Label>
        <Input type="text" name="radio2" id="radio2" placeholder="" />
      </FormGroup>
      {this.state.radioList}
      <FormGroup>
      <Button onClick={this.addRadioForm} size="lg" outline> + Add</Button>
      </FormGroup>
      </div>
      );
  }
}
export default RadioForm;
