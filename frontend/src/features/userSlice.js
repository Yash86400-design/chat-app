import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

// Get User Data from localstorage
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

const initialState = {
  // Global state
  userProfile: userProfile || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  statusCode: null,
  message: '',

  // Add request response for user/chatroom
  addRequestError: null, // for both user and chatroom
  addFriendResponseError: null,
  addMemberResponseError: null,
  returnedAddRequestResponse: null, // for adding request response
  returnedFriendRequestResponse: null,
  returnedChatroomRequestResponse: null,

  // Sending Message To User/Chatroom
  sendingMessageLoading: false,

  fetchingMessageLoading: false,
  createChatroomLoading: false,
  addRequestLoading: false, // for both user and chatroom
  friendRequestResponseLoading: false,
  chatroomRequestResponseLoading: false,
  unfriendUserLoading: false,
  exitChatroomLoading: false,
  unfriendMessage: '',
  exitChatroomMessage: '',
  createChatroomMessage: '',
  editProfileResponseMessage: null,
  editChatroomResponseMessage: null,
  editProfileResponseUserId: null,
  editChatroomResponseAdminId: null,
  editedChatroomId: null,
  editProfileResponseStatusCode: null,
  editChatroomResponseStatusCode: null,
  messageSendSatusCode: null,
  notificationReadStatusCode: null,
  notificationDeleteStatusCode: null,
  unfriendUserStatusCode: null,
  exitChatroomStatusCode: null,
  fetchUserResponse: null,
  fetchChatroomResponse: null,
  returnedUserMessage: null,
  returnedChatroomMessage: null,
  fetchMessageErrorMessage: null,
  createChatroomStatusCode: null,
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

// Editing Chatroom Info
export const editChatroomInfo = createAsyncThunk(
  "/edit-chatroom-info",
  async (chatroomData, thunkAPI) => {
    try {
      return await userService.chatroomEditInfo(chatroomData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message || error.toString();
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

// Mark one notification as read
export const readOneNotification = createAsyncThunk(
  '/notifications/reading',
  async (notificationId, thunkAPI) => {
    try {
      return await userService.markNotificationAsRead(notificationId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark all notifications as read
export const readAllNotifications = createAsyncThunk(
  '/notifications/reading-all',
  async (_, thunkAPI) => {
    try {
      return await userService.markAllNotificationsAsRead();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete all notifications
export const deleteAllNotifications = createAsyncThunk(
  "/notifications/deleting",
  async (_, thunkAPI) => {
    try {
      return await userService.deleteAllNotifications();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unfriend user
export const unfriendUser = createAsyncThunk(
  "/unfriending-user",
  async (friendId, thunkAPI) => {
    try {
      return await userService.unfriendUser(friendId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Exit chatroom
export const exitChatroom = createAsyncThunk(
  "/exiting-chatroom",
  async (chatroomId, thunkAPI) => {
    try {
      return await userService.exitChatroom(chatroomId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Read-All Chatroom Notifications (Action allowed for admins)
export const readAllChatroomNotifications = createAsyncThunk(
  "/chatroom/notifications/reading-all",
  async (chatroomId, thunkAPI) => {
    try {
      return await userService.readAllChatroomNotifications(chatroomId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete-all Chatroom Notifications (Action allowed only for admins)
export const deleteAllChatroomNotifications = createAsyncThunk(
  "/chatroom/notifications/deleting",
  async (chatroomId, thunkAPI) => {
    try {
      return await userService.deleteAllChatroomNotifications(chatroomId);
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
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.statusCode = null;
      state.message = '';
    },
    toastReset: (state) => {
      state.editedChatroomId = null;
      state.editChatroomResponseAdminId = null;
      state.editProfileResponseStatusCode = null;
      state.editChatroomResponseMessage = null;
    },
    resetState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.statusCode = null;
      state.message = '';
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
        state.editProfileResponseMessage = action.payload.message;
        state.editProfileResponseUserId = action.payload.userId;
        state.editProfileResponseStatusCode = action.payload.statusCode;
      })
      .addCase(editInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.editProfileResponseMessage = action.payload.message;
        state.editProfileResponseStatusCode = action.payload.statusCode;
      })
      .addCase(editChatroomInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editChatroomInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editChatroomResponseMessage = action.payload.message;
        state.editChatroomResponseAdminId = action.payload.adminId;
        state.editChatroomResponseStatusCode = action.payload.statusCode;
        state.editedChatroomId = action.payload.editedChatroomId;
      })
      .addCase(editChatroomInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.editChatroomResponseMessage = action.payload.message;
        state.editChatroomResponseStatusCode = action.payload.statusCode;
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
        state.fetchMessageErrorMessage = 'Unable to fetch messages, Please try after sometime...';
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
        state.messageSendSatusCode = action.payload.statusCode;
        state.returnedUserMessage = action.payload.message;
      })
      .addCase(sendMessageToUserResponse.rejected, (state) => {
        state.isError = true;
        state.message = 'Unable to send the message right now, Sorry for the inconvenience, Please try again after sometime!!!';
      })
      .addCase(sendMessageToChatroomResponse.fulfilled, (state, action) => {
        state.messageSendSatusCode = action.payload.statusCode;
        state.returnedChatroomMessage = action.payload.message;
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
        state.createChatroomStatusCode = action.payload.statusCode;
        state.createChatroomMessage = action.payload.message;
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.createChatroomLoading = false;
        state.createChatroomStatusCode = action.payload.statusCode;
        state.createChatroomMessage = action.payload.message;
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
      })
      .addCase(readOneNotification.fulfilled, (state, action) => {
        state.notificationReadStatusCode = action.payload.statusCode;
      })
      .addCase(readOneNotification.rejected, (state, action) => {
        state.notificationReadStatusCode = action.payload.statusCode;
      })
      .addCase(readAllNotifications.fulfilled, (state, action) => {
        state.notificationReadStatusCode = action.payload.statusCode;
      })
      .addCase(readAllNotifications.rejected, (state, action) => {
        state.notificationReadStatusCode = action.payload.statusCode;
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.notificationDeleteStatusCode = action.payload.statusCode;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.notificationDeleteStatusCode = action.payload.statusCode;
      })
      .addCase(unfriendUser.pending, (state) => {
        state.unfriendUserLoading = true;
      })
      .addCase(unfriendUser.fulfilled, (state, action) => {
        state.unfriendUserLoading = false;
        state.unfriendUserStatusCode = action.payload.statusCode;
        state.unfriendMessage = action.payload.message;
      })
      .addCase(unfriendUser.rejected, (state, action) => {
        state.unfriendUserLoading = false;
        state.unfriendUserStatusCode = action.payload.statusCode;
        state.unfriendMessage = action.payload.message;
      })
      .addCase(exitChatroom.pending, (state) => {
        state.exitChatroomLoading = true;
      })
      .addCase(exitChatroom.fulfilled, (state, action) => {
        state.exitChatroomLoading = false;
        state.exitChatroomStatusCode = action.payload.statusCode;
        state.exitChatroomMessage = action.payload.message;
      })
      .addCase(exitChatroom.rejected, (state, action) => {
        state.exitChatroomLoading = false;
        state.exitChatroomStatusCode = action.payload.statusCode;
        state.exitChatroomMessage = action.payload.message;
      })
      .addCase(readAllChatroomNotifications.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(readAllChatroomNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(readAllChatroomNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.statusCode = action.error.code;
        state.isError = true;
      })
      .addCase(deleteAllChatroomNotifications.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteAllChatroomNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(deleteAllChatroomNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message;
        state.statusCode = action.error.code;
        state.isError = true;
      });
  }
}
);
export const { reset, toastReset, resetState } = userSlice.actions;
export default userSlice.reducer;
