import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './org/common/components/App';
import Dashboard from './org/dashboard/Dashboard';
import Users from './org/users/Users';
import UserInfo from './org/users/UserInfo';
import Reports from './org/bugs/Reports';
import Surveys from './org/surveys/surveys';
import Settings from './org/settings/Settings';
import SignIn from './org/Signin';
import Libraries from './org/libraries/Libraries';
import Course from './org/course/Course';
import Task from './org/task/Task';
import Material from './org/libraries/Material';
import cookie from 'react-cookie';
import EditMaterial from './org/libraries/EditMaterial';
import Lesson from './org/lesson/lesson';

import userApp from './user/common/components/userApp';
import UserDashboard from './user/dashboard/UserDashboard';
import LeaderBoard from './user/leaderboard/LeaderBoard';
import UserLeadInfo from './user/userleadinfo/UserLeadInfo';
import UserSignIn from './user/userSignIn';
import UserLibraries from './user/libraries/Libraries';
import LandingPage from './user/landingpage/LandingPage';
import Class from './user/class/Class';
import Actions from './user/actions/Actions';
import UserSettings from './user/settings/UserSettings';
import UserDetails from './user/settings/UserDetails';
import Forums from './user/forums/Forums';
import Channel from './user/forums/Channel';

// import AuthService from './user/authService';
// const auth = new AuthService('Ujlyc_2CJFlErHHzEo-SpnEcSHL9TTux', 'purnesh.auth0.com');

function Authentication(nextState,replace) {
const isAuthenticated = (cookie.load('org_obj'))  ? true : false;
 if(!isAuthenticated) {
   replace({
     pathname: '/app',
     state: {nextPathname: nextState.location.pathname}
   });
 }
  //document.location.href='/app/dashboard'
}
function userAuthentication(nextState,replace) {
const isAuthenticated = (cookie.load('user_obj'))  ? true : false;
 if(!isAuthenticated) {
   replace({
     pathname: '/',
     state: {nextPathname: nextState.location.pathname}
   });
 }
  // if (!auth.loggedIn()) {
  //   replace({ pathname: '/' })
  // }
}

function scrollToTop() {
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}


export default (


     <Route path="/">
      <Route component={userApp}>
        <IndexRoute component={UserSignIn}/>
        <Route path="user" onEnter={userAuthentication}>
          <Route path="landingpage" component={LandingPage} />
          <Route path="dashboard" component={UserDashboard} />
          <Route path="class/:id" component={Class} onEnter={scrollToTop}/>
          <Route path="leaderboard" component={LeaderBoard}/>
          <Route path="userleadinfo/:id" component={UserLeadInfo} onEnter={scrollToTop}/>
          <Route path="libraries" component={UserLibraries} />
          <Route path="actions" component={Actions} />
          <Route path="settings" component={UserSettings} />
          <Route path="updatedetails" component={UserDetails} />
          <Route path="forums" component={Forums} />
          <Route path="forums/:id" component={Channel} />
        </Route>
      </Route>

      <Route path="app" component={App}>
        <IndexRoute component={SignIn} />
        <Route path="" onEnter={Authentication}>
          <Route path="dashboard" component={Dashboard} />
          <Route path="course/:id" component={Course} />
          <Route path="course/:courseId/class/:id" component={Lesson} />
          <Route path="course/:courseId/class/:classId/lesson/:id" component={Task} />
          <Route path="users" component={Users} />
          <Route path="users/:id" component={UserInfo} />
          <Route path="bugs" component={Reports} />
          <Route path="surveys" component={Surveys} />
          <Route path="libraries" component={Libraries}/>
          <Route path="libraries/addmaterial" component={Material} />
          <Route path="libraries/editmaterial/:id" component={EditMaterial} />
          <Route path="settings" component={Settings}/>
        </Route>
      </Route>
    </Route>
 );


