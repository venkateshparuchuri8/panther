import React , {Component} from 'react';
import { Container, Row } from 'reactstrap';

class MaterialsList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.materialId = this.materialId.bind(this);
  }

  materialId(event){
    event.preventDefault();
    this.setState({'material_id':parseInt(event.target.getAttribute('data-materialId'))})
    this.props.material_id(event.target.getAttribute('data-materialId'));
  }

  render() {
    const materials=this.props.materials || [];
    //const imagecheck=<img className="material-thumbnail-check" src="../../../../../../assets/icon-completed.svg"/>;
    return(
      <div>
      <Container>
        <Row >
          {materials.map((obj,index) =>
            
             <div key={index} className={this.state.material_id == obj.id ? "material-thumbnail is-selected" : "material-thumbnail"} style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url('+obj.hero_image+')'}} data-materialId={obj.id} data-materialImage={obj.hero_image} onClick={this.materialId}>
                <div className="material-thumbnail-name" >{obj.title}</div>
                <div className="material-thumbnail-icon">
                <img src={(obj.type == 'Video'? '/assets/video-icon.svg':'') || (obj.type == 'Article'? '/assets/article-icon.svg':'')
                  || (obj.type == 'PDF'? '/assets/pdf-icon.svg':'')|| (obj.type == 'Link'? '/assets/link-icon.svg':'')
                  || (obj.type == 'Podcast'? '/assets/audio-icon.svg':'') || (obj.type == 'Editor'? '/assets/icon-editor.svg':'')} /></div>
                  {this.state.material_id == obj.id ? <div className="material-edit-icon"><img src="/assets/icon-green-check.svg"/></div> : ''}
             </div>
            )}
        </Row>
        </Container>
      </div>
      );
  }

}

export default MaterialsList;
