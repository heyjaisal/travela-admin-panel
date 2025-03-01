import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: undefined,
  allowedPages: [], // Add this
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...action.payload,
        allowedPages: action.payload.allowedPages || [],
      };
    },
    setAllowedPages: (state, action) => {
      state.allowedPages = action.payload; // Add this
    },
    clearUserInfo: (state) => {
      state.userInfo = undefined;
      state.allowedPages = []; // Reset allowed pages
    },
  },
});

export const { setUserInfo, setAllowedPages, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
