export default function classReducer(state = {}, action) {

  switch (action.type) {
    case 'POST_CLASS_CREATE': {
      return action.value || {};
    }
    case 'POST_CLASS_PUBLISH':{
      return action.value || {};
    }
    case 'POST_CLASS_LIST':{
      return action.value || {};
    }
    case 'POST_CLASS_UPDATE':{
      return action.value || {};
    }
    default:
      return state;
  }
}
