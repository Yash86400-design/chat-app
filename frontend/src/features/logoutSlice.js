import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const logoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {
    logout: (state) => {
      return initialState;
    }
  }
});

export const { logout } = logoutSlice.actions;
export default logoutSlice.reducer;