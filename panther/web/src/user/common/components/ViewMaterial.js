import React,{Component,PropTypes} from 'react';
import {ModalBody, Button} from 'reactstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../libraries/actions/index';
import MaterialType from './MaterialType';
import Isvg from 'react-inlinesvg';
import Quiz from '../../class/Quiz';
import Reflection from '../../class/Reflection';


class ViewMaterial extends Component{
  constructor(props){
    super(props);
    this.state = {
      modal:false,
      materialFlag:false

    };
    this.renderform =this.renderform.bind(this);
    this.completeTask=this.completeTask.bind(this);
    this.materialflag = this.materialflag.bind(this);
  }
  materialflag(flag){
    this.setState({materialFlag:flag});
    //this.props.materialFlag(flag);
  }
  renderform(materialObj){
    if(materialObj.material_type == 'Quiz'){

      return (<Quiz materialobj= {materialObj} materialflag={this.materialflag}/> );

    }else if(materialObj.material_type == 'Reflection'){

      return (<Reflection materialobj={materialObj}  materialflag={this.materialflag} />);

    }else{

      if(materialObj.material_type == 'Video'){
        if(materialObj.url.indexOf('vimeo') != -1){
            let videoSplit = materialObj.url.split('/');
            let videoId = videoSplit[videoSplit.length -1];
            materialObj.url = "https://player.vimeo.com/video/" + videoId;
        }else{
          materialObj.url = materialObj.url.replace("watch?v=", "embed/");
          //materialObj.url = materialObj.url + "&output=embed";
        }

      }
      return(<MaterialType materialObj={materialObj} url={materialObj.url} />);
    }
  }
  completeTask(materialObj){
    this.props.completeTaskAction(materialObj);
  }
  render(){
    return(
      <div>
        <ModalBody >
          <div className="-modal-complete">
            <div className="-modal-complete-name">
            {this.props.materialObj.lesson_order != undefined ?
              <h1>{this.props.materialObj.lesson_order}.{this.props.materialObj.task_order} — {this.props.materialObj.task_name}</h1>
              : <h1>{this.props.materialObj.material_title} </h1>
            }
            </div>
            {this.props.materialFrom == 'classPage' && this.props.materialObj.task_status != 'completed'  &&  (this.props.materialObj.materialFlag ||this.state.materialFlag )?
            <div className="-modal-complete-action">
              <Button size="sm" className="btn-start" color="primary" onClick={this.completeTask.bind(this,this.props.materialObj)}><Isvg src="/assets/icon-check-white.svg"></Isvg>Complete</Button>
            </div> : ''}
          </div>
          {this.renderform(this.props.materialObj)}
        </ModalBody>
      </div>
    );
  }
}
ViewMaterial.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ViewMaterial.propTypes = {
 actions: PropTypes.object.isRequired,
 userLibrary:PropTypes.array
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth:state.auth,
    userLibrary : state.userLibrary


  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewMaterial);
