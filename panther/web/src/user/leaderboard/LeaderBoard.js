import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Row, Col, Input} from 'reactstrap';
import Page from '../common/components/Page';
//import {filter} from 'lodash';
import * as actions from './actions/index';
import cookie from 'react-cookie';
import _ from 'underscore';

class LeaderBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chaptersValue: "all" ,
      initialText:"Sorry, there are no Users here yet.",
      catagoryValue: "actions_count",
      usersBio:[]
    };

    this.handleChangeChapter = this.handleChangeChapter.bind(this);
    this.handleChangeCatagory = this.handleChangeCatagory.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.viewBio = this.viewBio.bind(this);
  }

  componentDidMount() {
    this.props.actions.getUsersBio(cookie.load('org_details').org_id);
  }

  handleChangeChapter(e){
    this.setState({
            chaptersValue: e.target.value });
  }

  handleChangeCatagory(e){
      this.setState({
            catagoryValue: e.target.value });
    
  }
  searchUser(e){
    e.preventDefault();
    this.setState({
            "searchValue": e.target.value });

  }


  viewBio(user){
    const path='/user/userleadinfo/'+user.user_id
    this.context.router.push(path);
  }

  render() {
    console.log(this.props.usersBio);
    let chapterValObj; 
   chapterValObj =  _.uniq(this.props.usersBio, function(obj) { 
      return obj.chapter; 
    });
   console.log(chapterValObj);


   let userArray ;
   let userArrayDescending;
   const me = this;
    if(this.props.usersBio&& this.state.chaptersValue && this.state.chaptersValue != 'all'){
     userArray = this.props.usersBio;
      let dropValue = this.state.chaptersValue;
      userArray = _.filter(userArray,_.matches({chapter:dropValue}));
          userArray =  _.sortBy(userArray, me.state.catagoryValue);
         userArrayDescending = userArray.reverse();

    }else{
      userArray = this.props.usersBio;
             userArray =  _.sortBy(userArray, me.state.catagoryValue);
              userArrayDescending = userArray.reverse();

    }
          if(this.state.searchValue && this.state.searchValue.length !=null){
         userArrayDescending = _.filter(userArrayDescending, function(obj){
            //return obj.name.indexOf(me.state.searchValue) > -1;
            let test=new RegExp(me.state.searchValue, 'i')
            return obj.name.match(test);
      });
    }

     
   




    //const img = 'http://im.vsco.co/1/54bf275c536301981228/58d5e67a26810e430d033c9b/vsco_032517.jpg?w=302&dpr=2';

    return (
    <div>

    <Page pageTitle="Leaderboard"
      pageDescription="See how you rank with your peers.">
      {this.props.usersBio.length!=0 ?
      <div>
      <Row className="mb-4">
        {/*<Col sm="4" md={{size: 4}} lg="3">
          <Input type="select" name="select" id="chapters" size="sm" value={this.state.chaptersValue} onChange = {this.handleChangeChapter}>
                        <option value="all">All Chapters</option>
                        {chapterValObj.map((user) => {
                          return(
                          <option value={user.chapter}>{user.chapter}</option>
                          );
                        })}
          
          
                    </Input>
        </Col>*/}
        <Col sm="4" md={{size: 4}} lg="3">
          <Input type="select" name="select" id="exampleSelect" size="sm" value={this.state.catagoryValue} onChange = {this.handleChangeCatagory}>
              <option value="actions_count">Actions Completed</option>
              <option value="total_points">XP</option>
          </Input>
        </Col>
        <Col sm={{ size: '3'}}>
            <div className="searchbox">
              <span className="mr-2"><img src="/assets/icon-search.svg"/></span>
              <span><Input type="text" placeholder="Find User" value={this.state.value} onChange={this.searchUser}/></span>
            </div>
          </Col>
      </Row>
       <Row>
        <Col md="12">
        {userArrayDescending.map((user, index) => {
          return(
          <div className="leaderboard-card" key={index} onClick={this.viewBio.bind(this, user)}>
            <div className="leaderboard-card-badge">{index+1}</div>
            <div className="leaderboard-card-top">
                <div className="lederboard-card-bg-img" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 0%, #FFFFFF 100%), url(' + user.profile_pic + ')'}}></div>
                <div className="leaderboard-card-top-user">
                  <div className="leaderboard-card-top-avatar" style={{backgroundImage: 'url(' + user.profile_pic + ')'}}></div>
                  <div className="leaderboard-card-top-name">{user.name}</div>
                </div>
            </div>
            <div className="leaderboard-card-bottom">
              <p><b>{user.total_points}</b> XP</p>
              <p><b>{user.actions_count}</b> Actions Completed</p>
              <p><b>{user.chapter}</b> Chapter</p>
            </div>
         </div>
          );
        })}
      </Col>
    </Row>
      </div>
:<div>
  <Row>
    <Col md="12">
      <h4 className="text-center mt-10">{this.state.initialText}</h4>
    </Col>
  </Row>
</div>}
    </Page>

  </div>

    );
  }
}


LeaderBoard.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    usersBio:state.usersBio


  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
   mapDispatchToProps
)(LeaderBoard);
