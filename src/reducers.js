import { SET_CURRENT_USER } from "./actions";

const DEFAULT_STATE = { currentUser: null, lol: 5 };

const setCurrentUser = (state, action) => {
  console.log('i run')
  console.log(action)
  return Object.assign({}, state, { currentUser: action.payload })
}

const rootReducer = (state = DEFAULT_STATE, action) => {
  console.log('loladaadfd')
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log('fucing shit')
      return setCurrentUser(state, action);
    default:
      console.log('mother fucker')
      return state;
  }
};

export default rootReducer;
