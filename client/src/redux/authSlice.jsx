// src/redux/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"), // Automatically set based on token presence
  role: null,
  loading: true, // Introduce a loading state to handle app initialization
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload; // action.payload should be a boolean
    },
    setRole: (state, action) => {
      state.role = action.payload; // action.payload should be a string or a serializable value
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // action.payload should be a boolean
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.loading = false;
    },
  },
});

export const { setAuthenticated, setRole, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
