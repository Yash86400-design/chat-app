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
  editProfileSuccess: false,
  isLoading: false,
  sendingMessageLoading: false,
  fetchingMessageLoading: false,
  message: '',
  editProfileSuccessMessage: '',
  statusCode: null,
  fetchUserResponse: null,
  fetchChatroomResponse: null,
  returnedUserMessage: null,
  returnedChatroomMessage: null
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
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// (User) Setting the loading state, fetching error
export const fetchUserMessages = createAsyncThunk(
  "/fetching..",
  async (userId, thunkAPI) => {
    try {
      return await userService.fetchUserMessages(userId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// (Chatroom) Setting the loading state, fetching error
export const fetchChatroomMessages = createAsyncThunk(
  "/fetching...",
  async (chatroomId, thunkAPI) => {
    try {
      return await userService.fetchGroupMessages(chatroomId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// (User) Setting the loading state, sending error and statuscode
export const sendMessageToUserResponse = createAsyncThunk(
  "/sending...",
  async (userData, thunkAPI) => {
    try {
      return await userService.messageSendToUser(userData.userId, userData.message);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// (Chatroom) Setting the loading state, sending error and statuscode
export const sendMessageToChatroomResponse = createAsyncThunk(
  "/sending..",
  async (userData, thunkAPI) => {
    try {
      return await userService.messageSendToChatroom(userData.chatroomId, userData.message);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
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
        state.editProfileSuccess = true;
        state.editProfileSuccessMessage = action.payload;
      })
      .addCase(editInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchUserMessages.pending, (state) => {
        state.fetchingMessageLoading = true;
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.fetchingMessageLoading = false;
        state.fetchUserResponse = action.payload;
      })
      .addCase(fetchUserMessages.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = 'Unable to fetch messages, Please try after sometime...';
      })
      .addCase(fetchChatroomMessages.pending, (state) => {
        state.fetchingMessageLoading = true;
      })
      .addCase(fetchChatroomMessages.fulfilled, (state, action) => {
        state.fetchingMessageLoading = false;
        state.fetchChatroomResponse = action.payload;
      })
      .addCase(fetchChatroomMessages.rejected, (state) => {
        state.fetchingMessageLoading = false;
        state.isError = true;
        state.message = 'Unable to fetch messages, Please try after sometime...';
      })
      .addCase(sendMessageToUserResponse.pending, (state) => {
        // state.isLoading = true;  // No need cause using socket, Only error message will help
      })
      .addCase(sendMessageToUserResponse.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.statusCode = 200;
        state.returnedUserMessage = action.payload;
      })
      .addCase(sendMessageToUserResponse.rejected, (state) => {
        // state.isLoading = false;
        state.isError = true;
        state.message = 'Unable to send the message right now, Sorry for the inconvenience, Please try again after sometime!!!';
      })
      .addCase(sendMessageToChatroomResponse.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(sendMessageToChatroomResponse.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.statusCode = 200;
        state.returnedChatroomMessage = action.payload;
      })
      .addCase(sendMessageToChatroomResponse.rejected, (state) => {
        // state.isLoading = false;
        state.isError = true;
        state.message = 'Unable to send the message right now, Sorry for the inconvenience, Please try again after sometime!!!';
      });
  }
}
);

export default userSlice.reducer;