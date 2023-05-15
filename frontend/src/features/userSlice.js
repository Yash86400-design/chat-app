import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

// Get User Data from localstorage
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

const initialState = {
  userProfile: userProfile ? userProfile : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Fetching the user
export const userData = createAsyncThunk(
  "/",
  async (_, thunkAPI) => {
    try {
      return await userService.signedUser();
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

export const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(userData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userData.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(userData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userProfile = null;
      });
  }
}
);

export default userSlice.reducer;