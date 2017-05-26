export default function actionReducer(state = [], action) {

  switch (action.type) {
    case 'CREATE_ACTION': {
      return action.value || [];
    }
    case 'ACTIONS_LIST': {
      return action.value || [];
    }
    case 'UPDATE_ACTION': {
      return action.value || [];
    }
    default:
      return state;
  }
}