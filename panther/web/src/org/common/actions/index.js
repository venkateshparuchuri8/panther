import $ from 'jquery';
import toastr from 'toastr';

export function getCourses(org_id) {
  //return { type: 'GET_COURSES', value: ['success','succees2'] };

  return function (dispatch) {
    $.post("/api/course/list/"+org_id+'').done((response) => {
      //if (response){
        return dispatch({ type: 'GET_COURSES', value: response.result });
      // }else{
      //   return { type: 'GET_COURSES' };
      // }
    });
  };
}

export function saveEditedCourse(obj){
  //return { type: 'POST_ORG_LOGIN', value: ['success','succees2'] };
  return function (dispatch) {
    const obj1={'courseObj':JSON.stringify(obj)};
    $.post("/api/course/updateCourse", obj1).done((response) => {
      //if (response){
        toastr.success("Course Updated Succesfully", "Success");
        return dispatch({ type: 'POST_COURSE_EDIT_SAVE', value: response.result});
      // }else{
      //   return { type: 'POST_ORG_LOGIN', value: response.result };
      // }
    });
  };
}


export function viewCourse(courseId){
  //return { type: 'VIEW_COURSES', value: ['success',courseId] };
  return function (dispatch) {
    $.post("/api/course/"+courseId+"").done((response) => {
      //if (response){
        return dispatch({ type: 'VIEW_COURSES', value: response[0]});
      // }else{
      //   return { type: 'VIEW_COURSES', value: response.result };
      // }
    });
  };
}

export function editCourse(courseId){
  //return { type: 'VIEW_COURSES', value: ['success',courseId] };
  return function (dispatch) {
    $.post("/api/course/edit/"+courseId+"").done((response) => {
      //if (response){
        return dispatch({ type: 'EDIT_COURSES', value: response.result});
      // }else{
      //   return { type: 'VIEW_COURSES', value: response.result };
      // }
    });
  };
}

export function courseCreation(obj){
  return function(dispatch){
    const obj1={'courseObj':JSON.stringify(obj)};
    $.post('/api/course/create',obj1).done((response) =>{
      toastr.success("Course Created Succesfully", "Success");
       return dispatch({type:'POST_COURSE_CREATE',value:response.result});
    });
  };
}

export function orgLogin(obj){
  //return { type: 'POST_ORG_LOGIN', value: ['success','succees2'] };
  return $.post("/api/user/login", obj);
      // }else{
      //   return { type: 'POST_ORG_LOGIN', value: response.result };
      // }
}

export function saveLoginDataToStore(value){
  return { type: 'POST_ORG_LOGIN', value };
}

export function orgLogout() {
  return { type: 'ORG_LOGOUT' };
}


export function getSurvey(org_id){
  //return { type: 'GET_SURVEY', value: ['success','succees2'] };

    return function (dispatch) {

        $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/survey/list?org_id='+org_id+'',
        dataType: "json",
        success: function(response) {
            return dispatch({ type: 'GET_SURVEY', value: response.result});
        }
      });

   };
}

export function surveyCreation(obj){
  //return { type: 'GET_SURVEY', value: ['success','succees2'] };
  return function(dispatch){
    $.post('/api/survey/create',obj).done((response) =>{
     return dispatch({type:'POST_SURVEY_CREATE',value:response.result});
    });
  };
}

export function surveyDelete(obj){
  //return { type: 'GET_SURVEY', value: ['success','succees2'] };
  return function(dispatch){
    $.post('/api/survey/delete',obj).done((response) =>{
     return dispatch({type:'POST_SURVEY_DELETE',value:response.result});
    });
  };
}

export function surveyStatusUpdate(obj){
  //return { type: 'GET_SURVEY', value: ['success','succees2'] };
  return function(dispatch){

       $.ajax({
        type: "PUT",
        url: '/api/survey/play',
        dataType: "json",
        data:obj,
        success: function(response) {
            return dispatch({type:'PUT_SURVEY_STATUSUPDATE',value:response.result});
        }
      });

  };
}


export function updateSurvey(obj){
  //return { type: 'GET_SURVEY', value: ['success','succees2'] };
  return function(dispatch){

       $.ajax({
        type: "PUT",
        url: '/api/survey/edit',
        dataType: "json",
        data:obj,
        success: function(response) {
            return dispatch({type:'PUT_SURVEY_UPDATE',value:response.result});
        }
      });

  };
}

// export function getSurveyDetails(survey_id){
//   //return { type: 'GET_SURVEY', value: ['success','succees2'] };

//     return function (dispatch) {

//         $.ajax({
//         type: "GET",
//         contentType: "application/json",
//         url: '/api/survey/surveydetails?survey_id='+survey_id+'',
//         dataType: "json",
//         success: function(response) {
//             return dispatch({ type: 'GET_SURVEY_DETAILS', value: response.result});
//         }
//       });

//    };
// }




export function createClass(obj){
  return function(dispatch){
    $.post('/api/class/create',obj).done((response) =>{
      toastr.success("Class Created Succesfully", "Success");
       return dispatch({type:'POST_CLASS_CREATE',value:response.result});
    });
  };
}

export function updateClass(obj){
  return function(dispatch){
    $.post('/api/class/update',obj).done((response) =>{
      toastr.success("Class Updated Succesfully", "Success");
       return dispatch({type:'POST_CLASS_UPDATE',value:response.result});
    });
  };
}

export function getAllClasses(course_id){
  return function(dispatch){
    $.post('/api/class/list/'+course_id+'').done((response) =>{
       return dispatch(updateStoreWithNewClasses(response.result));
    });
  };
}

export function publishClass(class_id,course_id){

   return  $.post('/api/class/publish/'+class_id+'/'+course_id+'');

}

export function publishLesson(lesson_id,class_id){

   return  $.post('/api/lesson/publish/'+lesson_id+'/'+class_id+'');

}

export function draftClass(class_id,course_id){
  return function(dispatch){
    $.post('/api/class/draft/'+class_id+'/'+course_id+'').done((response) =>{
       return dispatch({type:'POST_CLASS_DRAFT',value:response.result});
    });
  };
}

export function createLesson(obj){
  return function(dispatch){
    $.post('/api/lesson/create',obj).done((response) =>{
       toastr.success("Lesson Created Succesfully", "Success");
       return dispatch({type:'POST_LESSON_CREATE',value:response.result});
    });
  };
}

export function updateLesson(obj){
  return function(dispatch){
    $.post('/api/lesson/update',obj).done((response) =>{
      toastr.success("Lesson Updated Succesfully", "Success");
       return dispatch({type:'POST_LESSON_UPDATE',value:response.result});
    });
  };
}


export function getAllLessons(classId){
  return function(dispatch){
    $.post('/api/lesson/list/'+classId+'').done((response) =>{
      return dispatch(updateStoreWithNewLessons(response.result));
    });
  };
}

export function createMaterial(obj){
  return $.post('/api/material/addmaterial', obj);
}


export function updateMaterial(materialobj){
  return $.post('/api/material/updatedata',materialobj);
}

export function getMaterial(material_id){
  return function(dispatch){
    $.post('/api/material/'+material_id).done((response)=>{
      return dispatch({type:'GET_MATERIAL_DATA',value : response.result});
    });
  };
}


export function getAllMaterials(org_id){
  return function(dispatch){
    $.post('/api/material/orglist/'+ org_id).done((response)=>{
      return dispatch({type:'POST_MATERIAL_LIST',value : response.result});
    });
  };
}

export function getAllReflections(org_id){
  return function(dispatch){
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: '/api/reflection/orglist/'+ org_id,
      dataType: "json",
      success: function(response) {
          return dispatch({type:'GET_REFLECTION_LIST',value : response.result});
      }
    });
  };
}

export function getAllQuizzes(org_id){
  return function(dispatch){
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: '/api/quiz/orglist/'+ org_id,
      dataType: "json",
      success: function(response) {
          return dispatch({type:'GET_QUIZ_LIST',value : response.result});
      }
    });
  };
}

export function usersList(org_id) {
  //console.log("here I am")
return function (dispatch) {

      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/user/userlist/"+org_id,
        dataType: "json",
        success: function(response) {
             return dispatch({ type: 'GET_USER_LIST', value: response.result});
        }
      });
   };
}


/*export function usersExports(org_id) {
  //console.log("here I am")
return function (dispatch) {

        $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/user/userlist/exports"+org_id,
        dataType: "json",
        success: function(response) {
             return dispatch({ type: 'GET_EXPORT_LIST', value: response.result});
        }
      });
   };
}
*/



export function updateStoreWithNewClasses(value){
  return {type:'POST_CLASS_LIST', value};
}
export function updateStoreWithNewLessons(value){
  return {type:'POST_LESSONS_LIST', value};
}

export function createAction(obj){
  return function(dispatch){
    $.post('/api/action/create',obj).done((response)=>{
      toastr.success("Action Created Succesfully", "Success");
      return dispatch({type:'CREATE_ACTION',value : response.result});
    });
  };
}

export function updateAction(obj){
  return function(dispatch){
    $.post('/api/action/update',obj).done((response)=>{
      toastr.success("Action Updated Succesfully", "Success");
      return dispatch({type:'UPDATE_ACTION',value : response.result});
    });
  };
}

export function getAllActions(lesson_id){
  return function(dispatch){
    $.post('/api/action/list/'+lesson_id).done((response)=>{
      return dispatch({type:'ACTIONS_LIST',value : response.result});
    });
  };
}

export function createTask(obj){
  return function(dispatch){
    $.post('/api/tasks/create',obj).done((response)=>{
      toastr.success("Task Created Succesfully", "Success");
      return dispatch({type:'CREATE_TASK',value : response.result});
    });
  };
}

export function updateTask(obj, org_id){
  return function(dispatch){
    $.ajax({
        type: "PUT",
        url: '/api/tasks/update',
        dataType: "json",
        data:obj,
        success: function(response) {
          toastr.success("Task Updated Succesfully", "Success");
          dispatch(getAllMaterials(org_id));
          return dispatch({type:'UPDATE_TASK',value:response.result});
        }
      });
  };
}

export function getAllTasks(lesson_id){
  return function(dispatch){
    $.post('/api/tasks/list/'+lesson_id).done((response)=>{
      return dispatch({type:'TASKS_LIST',value : response.result});
    });
  };
}
export function createQuiz(obj){
  return function(dispatch){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/tasks/quiz/createtask",
        dataType: "json",
        data:JSON.stringify(obj),
        success: function(response) {
            toastr.success("Task Created Succesfully", "Success");
            dispatch(getAllMaterials(obj.organization_id));
            dispatch(getAllQuizzes(obj.organization_id));
            return dispatch({ type: 'CREATE_TASK_QUIZ', value: response.result});
        }
    });
  };
}
export function updateQuizTask(obj){
  return function(dispatch){
   $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: '/api/tasks/update/taskQuiz',
        dataType: "json",
        data:JSON.stringify(obj),
        success: function(response) {
          dispatch(getAllQuizzes(obj.organization_id));
          toastr.success("Task Updated Succesfully", "Success");
          return dispatch({type:'UPDATE_TASK_QUIZ',value:response.result});
        }
      });
  };
}
export function updateReflectionTask(obj){
  return function(dispatch){
   $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: '/api/tasks/update/taskReflection',
        dataType: "json",
        data:JSON.stringify(obj),
        success: function(response) {
          dispatch(getAllReflections(obj.organization_id));
          toastr.success("Task Updated Succesfully", "Success");
          return dispatch({type:'UPDATE_TASK_REFLECTION',value:response.result});
        }
      });
  };
}
export function createReflection(obj){
  return function(dispatch){
    $.post('/api/tasks/reflection/createtask' , obj).done((response)=>{
      toastr.success("Task Created Succesfully", "Success");
      dispatch(getAllMaterials(obj.organization_id));
      dispatch(getAllReflections(obj.organization_id));
      return dispatch({type:'CREATE_TASK_REFLECTION',value : response.result});
    });
  };
}
export function createMaterialInTask(obj){
  return function(dispatch){
    $.post('/api/tasks/material/createtask', obj).done((response)=>{
      toastr.success("Task Created Succesfully", "Success");
      dispatch(getAllMaterials(obj.organization_id));
      return dispatch({type:'CREATE_TASK_MATERIAL',value : response.result});
    });
  };
}

export function bugReports(org_id) {
  return function (dispatch) {
        $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/bug/list/"+org_id,
        dataType: "json",
        success: function(response) {
             return dispatch({ type: 'GET_BUG_LIST', value: response.result});
        }
      });
   };
}

export function updateBugStatus(obj){

  return function(dispatch){

       $.ajax({
        type: "PUT",
        url: '/api/bug/updateBug',
        dataType: "json",
        data:obj,
        success: function(response) {
            return dispatch({type:'UPDATE_BUG_STATUS',value:response.result});
        }
      });

  };
}
