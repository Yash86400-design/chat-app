// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isLoggedIn: false,
//   user: null,
//   token: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setAuthentication: (state, action) => {
//       state.isLoggedIn = true;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     clearAuthentication: (state) => {
//       state.isLoggedIn = false;
//       state.user = null;
//       state.token = null;
//     }
//   }
// });

// export const { loginSuccess, logoutSuccess } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Get userToken from localstorage
const userToken = JSON.parse(localStorage.getItem('userToken'));
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

const initialState = {
  userToken: userToken ? userToken : null,
  userProfile: userProfile ? userProfile : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: null,
  loginMessage: null,
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message = (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const signin = createAsyncThunk(
  "auth/signin",
  async (user, thunkAPI) => {
    try {
      return await authService.signin(user);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    await authService.logout();
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userToken = null;
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userToken = action.payload.token;
        state.userProfile = action.payload.userProfile;
        state.loginMessage = action.payload.message;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userToken = null;
        state.userProfile = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userToken = null;
        state.userProfile = null;
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;