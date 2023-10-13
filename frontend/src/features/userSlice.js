import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

// Get User Data from localstorage
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

const initialState = {
  userProfile: userProfile || null,
  isError: false,
  addRequestError: null,  // for both user and chatroom
  addFriendResponseError: null,
  addMemberResponseError: null,
  isSuccess: false,
  editProfileSuccess: false,
  isLoading: false,
  sendingMessageLoading: false,
  fetchingMessageLoading: false,
  createChatroomLoading: false,
  addRequestLoading: false,  // for both user and chatroom
  friendRequestResponseLoading: false,
  chatroomRequestResponseLoading: false,
  message: '',
  editProfileSuccessResponse: null,
  createChatroomMessage: '',
  statusCode: null,
  fetchUserResponse: null,
  fetchChatroomResponse: null,
  returnedUserMessage: null,
  returnedChatroomMessage: null,
  returnedCreateChatroomResponse: null,
  returnedAddRequestResponse: null, // for adding request response
  returnedFriendRequestResponse: null,
  returnedChatroomRequestResponse: null,
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

// Creating Chatroom
export const createChatroom = createAsyncThunk(
  "/creating-chatroom",
  async (formData, thunkAPI) => {
    try {
      return await userService.createChatroomResponse(formData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// For both: Add request for friend and Add request in chatroom
export const addRequest = createAsyncThunk(
  "/request",
  async (requiredData, thunkAPI) => {
    try {
      return await userService.joinRequest(requiredData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Accepting Friend Request
export const acceptRequest = createAsyncThunk(
  "/accepting-request",
  async (requiredData, thunkAPI) => {
    try {
      return await userService.friendRequestAccept(requiredData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Rejecting Friend Request
export const rejectRequest = createAsyncThunk(
  "/rejecting-request",
  async (requiredData, thunkAPI) => {
    try {
      return await userService.friendRequestReject(requiredData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Accepting Group Join Request
export const groupJoinAccept = createAsyncThunk(
  "/acceptingChatroom-request",
  async (requiredData, thunkAPI) => {
    try {
      return await userService.groupJoinRequestAccepted(requiredData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Rejecting Group Join Request
export const groupJoinReject = createAsyncThunk(
  "/rejectingChatroom-request",
  async (requiredData, thunkAPI) => {
    try {
      return await userService.groupJoinRequestRejected(requiredData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    reset: (state) => {
      state.userProfile = null;
    }
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
      .addCase(editInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editProfileSuccess = true;
        state.editProfileSuccessResponse = action.payload;
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
      .addCase(sendMessageToUserResponse.fulfilled, (state, action) => {
        state.statusCode = 200;
        state.returnedUserMessage = action.payload;
      })
      .addCase(sendMessageToUserResponse.rejected, (state) => {
        state.isError = true;
        state.message = 'Unable to send the message right now, Sorry for the inconvenience, Please try again after sometime!!!';
      })
      .addCase(sendMessageToChatroomResponse.fulfilled, (state, action) => {
        state.statusCode = 200;
        state.returnedChatroomMessage = action.payload;
      })
      .addCase(sendMessageToChatroomResponse.rejected, (state) => {
        state.isError = true;
        state.message = 'Unable to send the message right now, Sorry for the inconvenience, Please try again after sometime!!!';
      })
      .addCase(createChatroom.pending, (state) => {
        state.createChatroomLoading = true;
      })
      .addCase(createChatroom.fulfilled, (state, action) => {
        state.createChatroomLoading = false;
        state.returnedCreateChatroomResponse = action.payload;
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.createChatroomLoading = false;
        state.createChatroomMessage = action.payload;
      })
      .addCase(addRequest.pending, (state) => {
        state.addRequestLoading = true;
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        state.addRequestLoading = false;
        state.returnedAddRequestResponse = action.payload;
      })
      .addCase(addRequest.rejected, (state, action) => {
        state.addRequestLoading = false;
        state.addRequestError = action.payload;
      })
      .addCase(acceptRequest.pending, (state) => {
        state.friendRequestResponseLoading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.friendRequestResponseLoading = false;
        state.returnedFriendRequestResponse = action.payload.statusCode;
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.friendRequestResponseLoading = false;
        state.returnedFriendRequestResponse = action.payload.statusCode;
        state.addFriendResponseError = action.payload.message;
      })
      .addCase(rejectRequest.pending, (state) => {
        state.friendRequestResponseLoading = true;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.friendRequestResponseLoading = false;
        state.returnedFriendRequestResponse = action.payload.statusCode;
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.friendRequestResponseLoading = false;
        state.returnedFriendRequestResponse = action.payload.statusCode;
        state.addFriendResponseError = action.payload.message;
      })
      .addCase(groupJoinAccept.pending, (state) => {
        state.chatroomRequestResponseLoading = true;
      })
      .addCase(groupJoinAccept.fulfilled, (state, action) => {
        state.chatroomRequestResponseLoading = false;
        state.returnedChatroomRequestResponse = action.payload.statusCode;
      })
      .addCase(groupJoinAccept.rejected, (state, action) => {
        state.chatroomRequestResponseLoading = false;
        state.returnedChatroomRequestResponse = action.payload.statusCode;
        state.addMemberResponseError = action.payload.message;
      })
      .addCase(groupJoinReject.pending, (state) => {
        state.chatroomRequestResponseLoading = true;
      })
      .addCase(groupJoinReject.fulfilled, (state, action) => {
        state.chatroomRequestResponseLoading = false;
        state.returnedChatroomRequestResponse = action.payload.statusCode;
      })
      .addCase(groupJoinReject.rejected, (state, action) => {
        state.chatroomRequestResponseLoading = false;
        state.returnedChatroomRequestResponse = action.payload.statusCode;
        state.addMemberResponseError = action.payload.message;
      });
  }
}
);

export const { reset } = userSlice.actions;
export default userSlice.reducer;