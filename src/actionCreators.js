import { SET_CURRENT_USER } from "./actions";

export function setCurrentUser(user) {
  // console.log('this fire');
  // console.log(user)
  console.log(SET_CURRENT_USER);
  return { type: SET_CURRENT_USER, payload: user };
}
