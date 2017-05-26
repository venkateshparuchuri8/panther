export default function bugReducer(state = [], action) {

  switch (action.type) {
    case 'GET_BUG_LIST': {
      console.log(action.value);
      return action.value;
      
    }
    case 'UPDATE_BUG_STATUS': {
       let result = [];
      state.map((bug)=>{
          if(bug.bug_id == action.value.bug_id){
              result.push(action.value);
          }else{
            result.push(bug);
          }
      });
      console.log(result);
      return result || [];
      
    }
    default:
      return state;
  }
}
