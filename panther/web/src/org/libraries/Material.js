import React,{Component} from 'react';
import Page from '../common/components/Page';
import BreadCrumb from './BreadCrumb';
import CreateMaterial from './CreateMaterial';
import { Row, Col, Label} from 'reactstrap';


class Material extends Component{
	constructor(props){
		super(props);
		this.state = {
			materialflag:true
		}
		this.addMaterial = this.addMaterial.bind(this);
		this.material = this.material.bind(this);
		
	}
	addMaterial(data){
		console.log(data);
	}
	material(){
		this.setState({materialflag:true});

	}
	render(){
		return (
			<Page>
				<BreadCrumb/>
				<Row>
					<Col sm={{ size: 6, push: 2, pull: 2, offset: 1 }}>
						<Label>
							<h4>Add New Material</h4>
						</Label>
						<CreateMaterial newmaterial = {this.addMaterial} from ="library" materialshow={this.state.materialflag} materialaction={this.material} />
						
					</Col>
				</Row>
			</Page>
			
		);
	}

}

export default Material;