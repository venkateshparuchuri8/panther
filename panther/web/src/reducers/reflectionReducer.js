export default function reflectionReducer(state = [], action) {

  switch (action.type) {
    case 'GET_REFLECTION_LIST': {
      return action.value || [];
    }
    default:
      return state;
  }
}
