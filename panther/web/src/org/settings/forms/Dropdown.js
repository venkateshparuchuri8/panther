import React , {Component} from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';

class Dropdown extends Component{

  constructor(props) {
    super(props);

    this.state = {
      dropdownList: []
    };

    this.addDropdown = this.addDropdown.bind(this);
  }

  addDropdown(e) {
    e.preventDefault();

    
    const dropdownList = this.state.dropdownList;

    this.setState({
      dropdownList: dropdownList.concat(<FormGroup>
        <Label key={dropdownList.length} for="new-field-title">Dropdown Selection #{dropdownList.length}</Label>
        <Input type="text" name="dropdown2" id="dropdown2" placeholder="" />
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
        <Label for="new-field-title">Dropdown Selection #1</Label>
        <Input type="text" name="dropdown1" id="dropdown1" placeholder="" />
      </FormGroup>
      <FormGroup>
        <Label for="new-field-title">Dropdown Selection #2</Label>
        <Input type="text" name="dropdown2" id="dropdown2" placeholder="" />
      </FormGroup>
      <FormGroup>
      {this.state.dropdownList}
      <Button onClick={this.addDropdown} size="lg" outline> + Add</Button>
      </FormGroup>
      </div>
      );
  }
}
export default Dropdown;
