export default function materialReducer(state = [], action) {

  switch (action.type) {
    case 'POST_MATERIAL_CREATE': {
      return action.value || [];
    }
    case 'POST_MATERIAL_LIST': {
      return action.value || [];
    }
    case 'EDIT_MATERIAL':{
      return action.value || [];
    }
    case 'GET_MATERIAL_DATA':{
      return action.value || [];
    }
    default:
      return state;
  }
}
