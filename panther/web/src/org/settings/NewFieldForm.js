import React , {Component} from 'react';
import { ModalBody, Label, Input, FormGroup } from 'reactstrap';
import SingleLineForm from './forms/SingleLineForm';
import MultiLineForm from './forms/MultiLineForm';
import RadioForm from './forms/RadioForm';
import Dropdown from './forms/Dropdown';
import MultiCheckBoxForm from './forms/MultiCheckBoxForm';

class NewFieldForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: 'Single Line Text'
    };

    this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
  }

  onRadioBtnChange(e) {
    let value = e.target.value;
    this.setState({value: value});
  }

  render() {
    let renderForms = null;
    if(this.state.value == 'Single Line Text') {
        renderForms = <SingleLineForm/>;
    }
    if(this.state.value == 'Multi Line Text') {
        renderForms = <MultiLineForm/>;
    }
    if(this.state.value == 'Radio Button') {
        renderForms = <RadioForm/>;
    }
    if(this.state.value == 'Dropdown'){
        renderForms = <Dropdown/>;
    }
    if(this.state.value == 'Multiple Checkbox'){
        renderForms = <MultiCheckBoxForm/>;
    }
    return (
    <div>
      <ModalBody>
        <label className="mb-2">Field Type</label>
        <FormGroup>
          <Label check>
            <Input type="radio"
            value="Single Line Text"
            checked={this.state.value === 'Single Line Text'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Single Line Text</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Multi Line Text"
            checked={this.state.value === 'Multi Line Text'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Multi Line Text</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Radio Button"
            checked={this.state.value === 'Radio Button'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Radio Button</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Dropdown"
            checked={this.state.value === 'Dropdown'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Dropdown</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Multiple Checkbox"
            checked={this.state.value === 'Multiple Checkbox'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Multiple Checkbox</span>
          </Label>
        </FormGroup>
        {renderForms}
      </ModalBody>
    </div>
  );
  }
}


export default NewFieldForm;
