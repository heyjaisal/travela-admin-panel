// authReducer.js
import { SET_USER_ROLE, LOGOUT } from '../actions/authaction';

const initialState = {
  role: null,  // Initially, no role is set
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    case LOGOUT:  // Handle the logout action
      return {
        ...state,
        role: null,  // Reset the role to null
      };
    default:
      return state;
  }
};

export default authReducer;
