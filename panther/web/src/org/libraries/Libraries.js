import React,{Component,PropTypes} from 'react';
import Page from '../common/components/Page';
import { Row, Col} from 'reactstrap';
import {Link} from 'react-router';
import * as actions from '../common/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cookie from 'react-cookie';
//import BreadCrumb from './BreadCrumb';



class Libraries extends Component {
	constructor(props){
		super(props);
    this.state= {
      materialobj:''

    };
    this.editMaterial = this.editMaterial.bind(this);
	}
  componentDidMount() {
    this.props.actions.getAllMaterials(cookie.load('org_obj').org_id);
  }
	editMaterial(obj){
    this.context.router.push('/app/libraries/editmaterial/'+obj.id);
}


	render(){
		const materials=this.props.materials || [];

    return (
			<Page
			pageTitle="Library"
			pageDescription="Here you can add new or edit existing content">
				<Row>
					<Col>
            <div className="material-list">
            <div className="material-add"><Link to="/app/libraries/addmaterial">Add New Material<br/><span>+</span></Link></div>
              {materials.map((obj,index) =>
             <div key={index} className="material-thumbnail" style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url('+obj.hero_image+')'}}>
                <div className="material-thumbnail-name" >{obj.title}</div>
                <div className="material-thumbnail-icon">
                <img src={(obj.type == 'Video'? '/assets/video-icon.svg':'') || (obj.type == 'Article'? '/assets/article-icon.svg':'')
                  || (obj.type == 'PDF'? '/assets/pdf-icon.svg':'')|| (obj.type == 'Link'? '/assets/link-icon.svg':'')
                  || (obj.type == 'Podcast'? '/assets/audio-icon.svg':'') || (obj.type == 'Editor'? '/assets/icon-editor.svg':'')} /></div>
                <div className="material-edit-icon" onClick={()=>this.editMaterial(obj)}><img src="/assets/icon-edit-inverse.svg"/></div>
             </div>
            )}

            </div>
					</Col>
				</Row>

			</Page>
			);

	}
}
Libraries.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Libraries.propTypes = {
 actions: PropTypes.object.isRequired,
 materials:PropTypes.array
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth:state.auth,
    materials : state.materials


  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Libraries);
