import React,{Component} from 'react';
import Iframe from 'react-iframe';
//import ReactHtmlParser from 'react-html-parser';



class MaterialType extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
    this.getIframeUrl = this.getIframeUrl.bind(this);

  }
  componentWillMount(){
    this.setState({
      url:this.props.url
    });
  }

  getIframeUrl() {
    let url = this.state.url;
    if(url.indexOf('www.ted.com') != -1) {
      return url.replace('www.ted.com','embed.ted.com');
    }
    return url;
  }

render() {
    let iframeUrl = this.getIframeUrl();
    let classes = "material-container " + ((this.props.materialObj.material_type == "Article" || this.props.materialObj.can_embed == 0) ? "material-embed-outer" : "");

    return (
      <div className={classes}>
      {this.props.materialObj.material_type == "Link" || this.props.materialObj.material_type == "Article" || this.props.materialObj.can_embed == 0 ? 
        <div className="material-embed">
          <a target="_blank" href={this.props.materialObj.ogdata.url}>
            <div className="material-thumbnail" style={{backgroundImage: 'url('+(this.props.materialObj.ogdata.image ? this.props.materialObj.ogdata.image.url : '')+')',float:'left'}}>
            </div>
            <div className="material-embed-content">
              <div className="" style={{color:'#041e42'}}><h4>{this.props.materialObj.ogdata.title}</h4></div>
              <div className="" style={{color:'#041e42'}}><p>{this.props.materialObj.ogdata.description}</p></div>
            </div>
          </a>
        </div>
        :
        <Iframe url={iframeUrl}
        width="100%"
        height="400px"
        display="initial"
        position="relative"
        allowFullScreen />}
      </div>
      );
  }

}
export default MaterialType;
