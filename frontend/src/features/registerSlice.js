import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { registerStart, registerSuccess, registerFailure } = registerSlice.actions;
export default registerSlice.reducer;