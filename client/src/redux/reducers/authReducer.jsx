import { SET_USER_ROLE } from '../actions/authaction';

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
    default:
      return state;
  }
};

export default authReducer;
