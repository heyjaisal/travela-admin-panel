// authaction.js

export const SET_USER_ROLE = 'SET_USER_ROLE';
export const LOGOUT = 'LOGOUT';  // Add logout action type

export const setUserRole = (role) => {
  return {
    type: SET_USER_ROLE,
    payload: role,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,  // Action type for logout
  };
};
