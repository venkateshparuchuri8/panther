export default function taskReducer(state = [], action) {

  switch (action.type) {
    case 'CREATE_TASK': {
      return action.value || [];
    }
    case 'UPDATE_TASK': {
      return action.value || [];
    }
    case 'TASKS_LIST': {
      return action.value || [];
    }
    case 'CREATE_TASK_QUIZ': {
      return action.value || [];
    }
    case 'CREATE_TASK_REFLECTION': {
      return action.value || [];
    }
    case 'CREATE_TASK_MATERIAL': {
      return action.value || [];
    }
    case 'UPDATE_TASK_QUIZ': {
      return action.value || [];
    }
    case 'UPDATE_TASK_REFLECTION' : {
      return action.value || [];
    }
    default:
      return state;
  }
}
