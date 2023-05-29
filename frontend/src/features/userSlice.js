import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

// Get User Data from localstorage
// const userToken = JSON.parse(localStorage.getItem('userToken'));
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

const initialState = {
  // userToken: userToken ? userToken : null,
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

// Getting the user info
// export const userInfo = createAsyncThunk(
//   "/info", async (_, thunkAPI) => {
//     try {
//       return await userService.signedUser();
//     } catch (error) {
//       const message = (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) || error.message || error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// Editing User Info
export const editInfo = createAsyncThunk(
  "/edit-info",
  async (userData, thunkAPI) => {
    try {
      return await userService.editInfo(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Partial Query Suggestions (Friends/Groups)
// export const partialQuery = createAsyncThunk('/search',
//   async (searchQuery, thunkAPI) => {
//     try {
//       return await userService.fetchSuggestedTerms(searchQuery);
//     } catch (error) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

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
      })
      // .addCase(userInfo.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(userInfo.fulfilled, (state) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      // })
      // .addCase(userInfo.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload;
      // })
      .addCase(editInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(editInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
}
);

export default userSlice.reducer;