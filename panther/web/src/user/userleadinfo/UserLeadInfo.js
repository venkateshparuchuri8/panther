import React, { Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Row, Col} from 'reactstrap';
import ChildPage from '../common/components/ChildPage';
import { SocialIcons } from 'react-social-icons';
import * as actions from './actions/index';
import cookie from 'react-cookie';
var _ = require('lodash')


class UserLeadInfo extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.params.id);
    this.props.actions.getUsersLeadInfo(cookie.load('org_details').org_id);
    this.props.actions.getUsersRibbons(this.props.params.id);
  }

  render() {
    var me =this;
    let userObj;
    let socialUrls = [], ribbons = [];
    if(this.props.userLeadInfo !=undefined){
      userObj = _.filter(this.props.userLeadInfo, function(obj){
        if(obj.user_id == me.props.routeParams.id){
          return obj;
        }
      });
      //debugger;
       if(userObj[0] && userObj[0].facebook){
     socialUrls.push(userObj[0].facebook);
    }
    if(userObj[0] && userObj[0].twitter){
     socialUrls.push(userObj[0].twitter);
    }
    }

    

   

    ribbons = this.props.Ribbons.filter((user) => {
      return user.class_status == "completed";
    }).map(function(cls) {
      return cls.ribbon_url;
    });

    console.log(ribbons);

    return (

      <div>
    <ChildPage childPageType='userChild' backLink='/user/leaderboard' backText='Back to Leaderboard'>
    {userObj[0] ?
      <Row className="justify-content-md-center m-5 mx-auto">
        <Col sm="12" md="8" lg="6" xl="4">

          <div className="leaderboard-user-top">
            <div className="leaderboard-user-top-avatar" style={{backgroundImage: `url(${userObj[0].profile_pic})`}}></div>
            <div className="leaderboard-user-top-name">
              <h1>{userObj[0].name}</h1>
              <h2>{userObj[0].position}</h2>
            </div>
          </div>

          <div className="leaderboard-user">
          <section className="leaderboard-user-stats">
            <div>
              <h1>{userObj[0].total_points}</h1>
              <p>XP</p>
            </div>
            <div>
              <h1>{userObj[0].actions_count}</h1>
              <p>Actions Completed</p>
            </div>
            {userObj[0].chapter == null ? ''
            :
            <div>
              <h1>{userObj[0].chapter}</h1>
              <p>Chapter</p>
            </div>
            }
          </section>
          <section className="leaderboard-user-info">
            {userObj[0].profile_bio == null ? ''
            :
            <div className="leaderboard-user-stats-bio">
              <label>Bio</label>
              <p>{userObj[0].profile_bio}</p>
            </div>
            }
            
            {socialUrls.length == 0 ? ''
            :
            <div className="leaderboard-user-stats-social">
              <label>Social</label>
              <section>
                <SocialIcons urls={socialUrls} />
              </section>
            </div>
            }
            <div className="leaderboard-user-stats-ribbons">
              <label>Ribbons</label>
              <section>
              {ribbons.length == 0 ? 'No ribbons earned yet.'
              :
              ribbons.map((url) => {
                return (
                  <div className="r-1-image"><img className="r-1-image" src={url}/></div>
                )
              })
              }
              </section>
            </div>
          </section>
        </div>
        </Col>
      </Row>
      :null}
    </ChildPage>
    </div>

    );
  }
}


function mapStateToProps(state) {
  return {
    userLeadInfo:state.userLeadInfo,
    usersBio:state.usersBio,
    Ribbons:state.Ribbons
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
)(UserLeadInfo);
