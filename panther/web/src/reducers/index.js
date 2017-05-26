// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import coursesReducer from './coursesReducer';
import authReducer from './authReducer';
import viewcourseReducer from './viewCourse';
import surveyReducer from './surveyReducer';
import classReducer from './classReducer';
import lessonReducer from './lessonReducer';
import materialReducer from './materialReducer';
import reflectionReducer from './reflectionReducer';
import quizReducer from './quizReducer';
import userReducer from './userReducer';
import editCourseReducer from './editCourseReducer';
import actionReducer from './actionReducer';
import taskReducer from './taskReducer';
import bugReducer from './bugReducer';

import userAuthReducer from '../user/common/reducers/userAuthReducer';
import userCourseReducer from '../user/common/reducers/userCourseReducer';
import memberReducer from '../user/dashboard/reducers/memberReducer';
import surveyDataReducer from '../user/dashboard/reducers/surveyDataReducer';
import surveyStatReducer from '../user/dashboard/reducers/surveyStatReducer';
import userBioReducer from '../user/leaderboard/reducers/userBioReducer';
import userLibraryReducer from '../user/libraries/reducers/userLibraryReducer';
import userInfoLeadReducer from '../user/userleadinfo/reducers/userInfoLeadReducer';
import RibbonsReducer from '../user/userleadinfo/reducers/RibbonsReducer';
import classPageReducer from '../user/class/reducers/ClassPageReducer';
import userActionReducer from '../user/actions/reducers/actionsReducer';
import userInfoReducer from '../user/settings/reducers/userInfoReducer'; 
import notificationReducer from '../user/common/reducers/notificationReducer';
import userPointsReducer from '../user/common/reducers/userPointsReducer';



const appReducer = combineReducers({
  courses: coursesReducer,
  auth: authReducer,
  surveys: surveyReducer,
  courseView: viewcourseReducer,
  classes: classReducer,
  routing: routerReducer,
  usersList:userReducer,
  materials:materialReducer,
  reflections:reflectionReducer,
  quizzes:quizReducer,
  lessons: lessonReducer,
  editCourse: editCourseReducer,
  actions:actionReducer,
  tasks:taskReducer,
  usersBio:userBioReducer,
  userLeadInfo:userInfoLeadReducer,
  Ribbons:RibbonsReducer,
  bugReports : bugReducer,

  userAuth: userAuthReducer,
  userCourses: userCourseReducer,
  memberCourses:memberReducer,
  userSurveyStatus:surveyDataReducer,
  surveyStatUpdate:surveyStatReducer,
  userLibrary:userLibraryReducer,
  classPageDetails:classPageReducer,
  userActions : userActionReducer,
  userInfoReducer: userInfoReducer,
  notificationsList: notificationReducer,
  userPoints:userPointsReducer
});

const rootReducer = (state, action) => {
  let newState;
  if (action.type === 'ORG_LOGOUT') {
    newState = undefined;
  } else {
    newState = state;
  }

  return appReducer(newState, action);
};

export default rootReducer;
