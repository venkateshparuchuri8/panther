export default function classPageReducer(state = [], action) {

  switch (action.type) {
    case 'GET_CLASS_PAGE_DETAILS': {
      return action.value || {};
    }
    case 'UPDATE_ACTIONS' : {
      let result = {...state};
      let lessonsA=[];
      result.lessons.map((less) => {
        if(less.action_id ==action.value.action_id){
          less.action_status='completed';
          less.lesson_status="completed";
        }
        lessonsA.push(less);
      });
      if(action.value.currentClassStatus == 'completed'){
        result.class_status="completed";
      }
      result.lessons=lessonsA;
      return result || {};
    }
    case 'UPDATE_BOOKMARK_ACTION' : {
      let result = {...state};
      let lessonsA=[];
      result.lessons.map((less) => {
      if(less.lesson_id == action.value.lesson_id){
          let lessonObj={};
          let tasksA=[];
          less.tasks.map((task) => {
              if(task.task_id == action.value.task_id){
              const object=task;
              object.bookmarked=action.value.bookmarked;
              tasksA.push(object);
              }else{
              tasksA.push(task);
              }
          });
          delete less.tasks;
          lessonObj=less;
          lessonObj.tasks=tasksA;
           
          lessonsA.push(lessonObj);
      }else{
          
          lessonsA.push(less);
          
      }
      });
      result.lessons=lessonsA;
      return result || {};
    }
    case 'TASK_STATUS_UPDATE':{
      let result = {...state};
      let lessonsA=[];
      result.lessons.map((less) => {
      if(less.lesson_id == action.value.lesson_id){
          let lessonObj={};
          let tasksA=[];
          less.tasks.map((task) => {
              if(task.task_id == action.value.task_id){
              const object=task;
              object.task_status='completed';
              tasksA.push(object);
              }else if(task.task_id == action.value.nextTaskId){
              const object=task;
              object.task_status='started';
              tasksA.push(object);
              }else{
              tasksA.push(task);
              }
          });
          delete less.tasks;
          lessonObj=less;
          if(action.value.action_id){
            if(lessonObj.action_id==action.value.action_id){
              lessonObj.action_status='started';
            }
          }
          if(action.value.lessonCompleteId){
            if(lessonObj.lesson_id ==action.value.lessonCompleteId){
              lessonObj.lesson_status="completed";
            }
          }
          lessonObj.tasks=tasksA;
           
          lessonsA.push(lessonObj);
      }else{
          if(less.lesson_id == action.value.nextLessonId){
            less.lesson_status='started';
            less.tasks[0].task_status='started';
            lessonsA.push(less);
          }else{
          lessonsA.push(less);
          }
      }
      });
      if(action.value.currentClassStatus == 'completed'){
        result.class_status="completed";
      }
      result.lessons=lessonsA;
      return result || {};
    }
    default:
      return state;
  }
}