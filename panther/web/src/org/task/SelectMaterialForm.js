import React , {Component} from 'react';
import { ModalBody, Label, Input, FormGroup, ModalFooter, Button } from 'reactstrap';
//import SingleLineForm from './forms/SingleLineForm';
//import MultiLineForm from './forms/MultiLineForm';
//import RadioForm from './forms/RadioForm';
//import Dropdown from './forms/Dropdown';
//import MultiCheckBoxForm from './forms/MultiCheckBoxForm';
import MaterialsList from './MaterialsList';
let _ = require('lodash');

class SelectMaterial extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: 'All'
    };

    this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
    this.selectOneMaterial=this.selectOneMaterial.bind(this);
    this.getMaterialId=this.getMaterialId.bind(this);
  }

  onRadioBtnChange(e) {
    let value = e.target.value;
    this.setState({value: value});
    let materialsFilter=[];
    if(value == "All"){
       materialsFilter=this.props.materials;
    }else{
       materialsFilter=_.filter(this.props.materials, _.matches({ 'type':value }));
    }
    this.setState({'materials':materialsFilter});
  }
  selectOneMaterial(event){
    event.preventDefault();
    this.props.materialSelected(this.state.material_id);
  }

  getMaterialId(material_id){
    this.setState({'material_id':material_id})
  }

  render() {
    let renderForms = null;
    if(this.state.value == 'All') {
        //renderForms = <SingleLineForm/>;
        renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    if(this.state.value == 'Video') {
      renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    if(this.state.value == 'Article') {
        renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    if(this.state.value == 'PDF'){
        renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    if(this.state.value == 'Podcast'){
        renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    if(this.state.value == 'Editor'){
        renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    if(this.state.value == 'Link'){
        renderForms = <MaterialsList material_id={this.getMaterialId}  materials={this.state.materials || this.props.materials}/>;
    }
    return (
    <div>
      <ModalBody>
        <FormGroup>
          <Label check>
            <Input type="radio"
            value="All"
            checked={this.state.value === 'All'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>All</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Video"
            checked={this.state.value === 'Video'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Video</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Article"
            checked={this.state.value === 'Article'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Article</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="PDF"
            checked={this.state.value === 'PDF'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>PDF</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Podcast"
            checked={this.state.value === 'Podcast'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Podcast</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Editor"
            checked={this.state.value === 'Editor'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Editor</span>
          </Label>
          <Label check>
            <Input type="radio"
            value="Link"
            checked={this.state.value === 'Link'}
            onChange={this.onRadioBtnChange} />{' '}
            <span>Link</span>
          </Label>
        </FormGroup>
        {renderForms}
      </ModalBody>
      <ModalFooter>
        <Button size="lg" color="primary" onClick={this.selectOneMaterial}>Select</Button>
        <Button size="lg" className="btn-cancel" color="cancel">Cancel</Button>
      </ModalFooter>
    </div>
  );
  }
}


export default SelectMaterial;
