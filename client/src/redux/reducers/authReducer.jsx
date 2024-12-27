import { SET_USER_ROLE, LOGOUT } from '../actions/authaction';

const initialState = {
  role: null,  
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    case LOGOUT:  
      return {
        ...state,
        role: null,  
      };
    default:
      return state;
  }
};

export default authReducer;
