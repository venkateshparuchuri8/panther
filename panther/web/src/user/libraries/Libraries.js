import React , {Component,PropTypes} from 'react';
import Page from '../common/components/Page';
import {Row, Col, Input , Modal } from 'reactstrap';
import * as actions from '../libraries/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import ViewTaskModal from '../common/components/ViewTaskModal';
import cookie from 'react-cookie';
import $ from 'jquery';

class UserLibraries extends Component{
  constructor(props){
    super(props);
    this.state = {
      modal : false,
      initialText: 'Sorry, you have not Unlocked any Materials yet. Head on over to Dashboard to start taking some classes.'
    };
    this.changeDropdown = this.changeDropdown.bind(this);
    this.viewMaterial = this.viewMaterial.bind(this);
    this.toggle = this.toggle.bind(this);
    this.searchTask = this.searchTask.bind(this);
    this.saveBug = this.saveBug.bind(this);
    this.bookmarking=this.bookmarking.bind(this);


  }
  componentDidMount() {
    this.props.actions.materialList(cookie.load('user_obj').user_id);

  }
  componentWillReceiveProps(props){
    this.setState({materialsList:props.userLibrary});
  }
  bookmarking(materialObj){
    let bookmarkObj={};
    bookmarkObj.user_id=cookie.load('user_obj').user_id;
    if(materialObj.bookmarked == 1){
      bookmarkObj.bookmarked=0;
    }else{
      bookmarkObj.bookmarked=1;
    }
    bookmarkObj.material_id = materialObj.material_id;
    bookmarkObj.task_id=materialObj.task_id;
    bookmarkObj.lesson_id=materialObj.lesson_id;
    this.props.actions.bookMarkingMaterial(bookmarkObj);
  }
  changeDropdown(e){
    e.preventDefault();
    this.setState({'selectedValue':e.target.value});
    let materials = [];
    if(e.target.value == 'completed'){
        materials = _.filter(this.props.userLibrary, function(obj){
          return obj.status  == 'completed';
        });
    }else if(e.target.value == 'content'){
      materials = _.filter(this.props.userLibrary, function(obj){
        return obj.material_type  == 'Editor';
      });
    }else if(e.target.value == 'article'){
      materials = _.filter(this.props.userLibrary, function(obj){
        return obj.material_type  == 'Article';
      });
    }else if(e.target.value == 'pdf'){
      materials = _.filter(this.props.userLibrary, function(obj){
        return obj.material_type  == 'PDF';
      });
    }else if(e.target.value == 'podcast'){
      materials = _.filter(this.props.userLibrary, function(obj){
        return obj.material_type  == 'Podcast';
      });
    }else if(e.target.value == 'link'){
      materials = _.filter(this.props.userLibrary, function(obj){
        return obj.material_type  == 'Link';
      });
    }else if(e.target.value == 'bookmarked'){
      materials = _.filter(this.props.userLibrary,function(obj){
        return obj.bookmarked == 1;
      });
      if(materials.length == 0){
        this.setState({'initialText': "You can Boomark content by clicking on the Bookmark icon on the top of tasks in your Dashboard"});
      }
    }
    this.setState({materialsList:materials});
  }
  viewMaterial(e){
    //e.preventDefault();
    this.setState({
      'material_obj':e
    });
    if(e.material_type == 'Article' || e.material_type == 'Link'){
      let materialObject={
        "material_url" : e.url//'https://m.signalvnoise.com/correcting-unrealistic-expectations-b75c7039445d'
      };
      let me=this;
      $.post('/api/articles/modaldata', materialObject).done((response) => {
         e.ogdata=response.result;
         me.setState({ 'material_obj': e });
         me.toggle();
      });
    }else{
      this.toggle();
    }

   }
   toggle(){
    this.setState({
      modal:!this.state.modal
    });
   }
   searchTask(e){
    e.preventDefault();
    const materials = _.filter(this.props.userLibrary, function(obj){
      return obj.material_title.indexOf(e.target.value) > -1;
    });
    console.log(materials);
    this.setState({
      materialsList : materials
    });
   }

     saveBug(data,id){
    let obj= {};
    obj.task_id = id ;
    obj.user_id = cookie.load('user_obj').user_id ;
    obj.description = data;
    $.post('/api/bug/createbug', obj).done((response) => {
        console.log(response);
    });

  }

  render(){
    const materials = this.state.materialsList || [];

    return (
      <Page pageTitle="Your Library" pageDescription="See items that you've unlocked here." >

        <Row className="mb-3">
          <Col md="4" lg="3">
            <Input type="select" name="select" size="sm" value={this.state.selectedValue} onChange = {this.changeDropdown}>
              <option value="completed">All Completed</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="content">Additional Content</option>
              <option value="article">Article</option>
              <option value="pdf">PDF</option>
              <option value="podcast">Podcast</option>
              <option value="doc">Doc</option>
              <option value="link">Link</option>
            </Input>
          </Col>
          <Col md="4">
            <div className="searchbox">
              <span className="mr-2"><img src="/assets/icon-search.svg"/></span>
              <span><Input type="text" placeholder="Find Task" value={this.state.value} onChange={this.searchTask}/></span>
            </div>
          </Col>
          </Row>
          <Row>
          <Col >
            <div>
              {materials.length === 0 ?
                <h4 className="text-center mt-10">{this.state.initialText}</h4>
              : ''}
              {materials.map((obj,index) =>
              <div key={index} data-material_obj={obj} data-material_id ={obj.material_id} data-material_title={obj.material_title} data-material_url={obj.url} onClick={this.viewMaterial.bind(this,obj)} className="library-thumb-img" style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' + obj.hero_image + ')'}}>

                <div className="library-thumb-img-name" id={obj.material_id} title={obj.material_title}>{obj.material_title}
                </div>
                <img className="bookmark" src={obj.bookmarked==1? "/assets/icon-bookmark-white.svg": ""} />
                <img className="completed" src="/assets/icon-check-white.svg" />
              </div>
             )}
             <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ViewTaskModal bookmarking={this.bookmarking}  materialObj={this.state.material_obj} closeModal={this.toggle} saveBugReport = {this.saveBug}/>
              </Modal>
            </div>
           </Col>
        </Row>
      </Page>
    );

  }
}
UserLibraries.contextTypes = {
  router: React.PropTypes.object.isRequired
};

UserLibraries.propTypes = {
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
)(UserLibraries);
