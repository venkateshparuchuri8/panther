export default function userCourseReducer(state = [], action) {

  switch (action.type) {
    case 'GET_COURSES': {
      return action.value || [];
    }
    case 'POST_COURSE_CREATE': {
      return [...state, action.value] || [];
    }
    case 'POST_COURSE_EDIT_SAVE':{
      let result = []
      state.map((course)=>{
          if(course.id == action.value.id){
              result.push(action.value)
          }else{
            result.push(course)
          }
      });
      return result || []
    }
    default:
      return state;
  }
}
