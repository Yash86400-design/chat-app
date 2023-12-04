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
  addRequestLoading: false, // for both user and chatroom
  addRequestError: null, // for both user and chatroom
  addRequestResponseMessage: '', // for adding request response
  addRequestResponseSenderId: null,
  addRequestResponseStatusCode: null,
  addRequestResponseChatroomId: null,

  // Friend Request / Group Add Request Response
  friendRequestResponseLoading: false,
  addFriendResponseError: null,
  returnedFriendRequestResponse: null,
  chatroomRequestResponseLoading: false,
  addMemberResponseError: null,
  returnedChatroomRequestResponse: null,

  // fetching chatroom info
  fetchChatroomLoading: false,
  fetchChatroomInfoMessage: '',
  fetchChatroomStatusCode: null,
  fetchChatroomRoomId: null,
  fetchChatroomMemberId: null,
  
  // Message fetching for both user and chatroom
  fetchingUserMessageLoading: false,
  fetchingUserMessageUserId: null,
  fetchingUserMessageReceiverId: null,
  fetchingUserMessageStatusCode: null,
  fetchingUserMessagesErrorMessage: '',

  // Message fetching for chatroom
  fetchingChatroomMessageLoading: false,
  fetchingChatroomMessageMemberId: null,
  fetchingChatroomMessageRoomId: null,
  fetchingChatroomMessageStatusCode: null,
  fetchingChatroomMessageErrorMessage: '',

  createChatroomLoading: false,
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

  // ChatroomNotifications states
  chatroomNotificationReadDeleteLoading: false,
  chatroomNotificationReadDeleteMessage: '',
  chatroomNotificationReadDeleteStatusCode: null,
  chatroomNotificationReadDeleteRoomId: null,
  chatroomNotificationReadDeleteAdminId: null,

  // Group Join/Reject State
  chatroomJoinRejectLoading: false,
  chatroomJoinRejectMessage: '',
  chatroomJoinRejectStatusCode: null,
  chatroomJoinRejectRoomId: null,
  chatroomJoinRejectAdminId: null
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

// Fetching Chatroom Info
export const chatroomInfo = createAsyncThunk(
  "/fetching-chatroominfo",
  async (chatroomId, thunkAPI) => {
    try {
      return await userService.fetchChatroomInfo(chatroomId);
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

      // Chatroom Notification Operations
      state.chatroomNotificationReadDeleteLoading = false;
      state.chatroomNotificationReadDeleteMessage = '';
      state.chatroomNotificationReadDeleteStatusCode = null;
      state.chatroomNotificationReadDeleteRoomId = null;
      state.chatroomNotificationReadDeleteAdminId = null;

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
      .addCase(chatroomInfo.pending, (state) => {
        state.fetchChatroomLoading = true;
      })
      .addCase(chatroomInfo.fulfilled, (state, action) => {
        state.fetchChatroomLoading = false;
        state.fetchChatroomInfoMessage = action.payload.message;
        state.fetchChatroomStatusCode = action.payload.statusCode;
        state.fetchChatroomMemberId = action.payload.memberId;
        state.fetchChatroomRoomId = action.payload.roomId;
      })
      .addCase(chatroomInfo.rejected, (state, action) => {
        state.fetchChatroomLoading = false;
        state.fetchChatroomStatusCode = action.payload.statusCode;
        state.fetchChatroomInfoMessage = action.payload.message;
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
        state.fetchingUserMessageLoading = true;
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.fetchingUserMessageLoading = false;
        state.fetchingUserMessageUserId = action.payload.senderId;
        state.fetchingUserMessageReceiverId = action.payload.receiverId;
        state.fetchingUserMessageStatusCode = action.payload.statusCode;
      })
      .addCase(fetchUserMessages.rejected, (state, action) => {
        state.fetchingUserMessageLoading = false;
        // state.fetchingUserMessagesErrorMessage = 'Unable to fetch messages, Please try after sometime...';
        state.fetchingUserMessagesErrorMessage = action.payload.message;
        state.fetchingUserMessageStatusCode = action.payload.statusCode
      })
      .addCase(fetchChatroomMessages.pending, (state) => {
        state.fetchingChatroomMessageLoading = true;
      })
      .addCase(fetchChatroomMessages.fulfilled, (state, action) => {
        state.fetchingChatroomMessageLoading = false;
        state.fetchingChatroomMessageMemberId = action.payload.memberId;
        state.fetchingChatroomMessageRoomId = action.payload.roomId;
        state.fetchingChatroomMessageStatusCode = action.payload.statusCode
      })
      .addCase(fetchChatroomMessages.rejected, (state, action) => {
        state.fetchingChatroomMessageLoading = false;
        // state.fetchingChatroomMessageErrorMessage = 'Unable to fetch messages, Please try after sometime...';
        state.fetchingChatroomMessageErrorMessage = action.payload.message;
        state.fetchingChatroomMessageStatusCode = action.payload.statusCode
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
        state.addRequestResponseMessage = action.payload.message;
        state.addRequestResponseSenderId = action.payload.senderId;
        state.addRequestResponseStatusCode = action.payload.statusCode;
        state.addRequestResponseChatroomId = action.payload.chatroomId;
      })
      .addCase(addRequest.rejected, (state, action) => {
        state.addRequestLoading = false;
        state.addRequestResponseMessage = action.payload.message;
        state.addRequestResponseSenderId = action.payload.senderId;
        state.addRequestResponseStatusCode = action.payload.statusCode;
        state.addRequestResponseChatroomId = action.payload.chatroomId;
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
        state.chatroomJoinRejectLoading = true;
      })
      .addCase(groupJoinAccept.fulfilled, (state, action) => {
        state.chatroomJoinRejectLoading = false;
        state.chatroomJoinRejectMessage = action.payload.message;
        state.chatroomJoinRejectStatusCode = action.payload.statusCode;
        state.chatroomJoinRejectRoomId = action.payload.roomId;
        state.chatroomJoinRejectAdminId = action.payload.adminId;
      })
      .addCase(groupJoinAccept.rejected, (state, action) => {
        state.chatroomJoinRejectLoading = false;
        state.chatroomJoinRejectMessage = action.response.message;
        state.chatroomJoinRejectStatusCode = action.response.statusCode;
        state.chatroomJoinRejectRoomId = action.response.roomId;
        state.chatroomJoinRejectAdminId = action.response.adminId;
      })
      .addCase(groupJoinReject.pending, (state) => {
        state.chatroomJoinRejectLoading = true;
      })
      .addCase(groupJoinReject.fulfilled, (state, action) => {
        state.chatroomJoinRejectLoading = false;
        state.chatroomJoinRejectMessage = action.payload.message;
        state.chatroomJoinRejectStatusCode = action.payload.statusCode;
        state.chatroomJoinRejectRoomId = action.payload.roomId;
        state.chatroomJoinRejectAdminId = action.payload.adminId;
      })
      .addCase(groupJoinReject.rejected, (state, action) => {
        state.chatroomJoinRejectLoading = false;
        state.chatroomJoinRejectMessage = action.response.message;
        state.chatroomJoinRejectStatusCode = action.response.statusCode;
        state.chatroomJoinRejectRoomId = action.response.roomId;
        state.chatroomJoinRejectAdminId = action.response.adminId;
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
      .addCase(readAllChatroomNotifications.pending, (state) => {
        state.chatroomNotificationReadDeleteLoading = true;
      })
      .addCase(readAllChatroomNotifications.fulfilled, (state, action) => {
        state.chatroomNotificationReadDeleteLoading = false;
        state.chatroomNotificationReadDeleteMessage = action.payload.message;
        state.chatroomNotificationReadDeleteStatusCode = action.payload.statusCode;
        state.chatroomNotificationReadDeleteRoomId = action.payload.chatroomId;
        state.chatroomNotificationReadDeleteAdminId = action.payload.adminId;
      })
      .addCase(readAllChatroomNotifications.rejected, (state, action) => {
        state.chatroomNotificationReadDeleteLoading = false;
        state.chatroomNotificationReadDeleteMessage = action.payload.message;
        state.chatroomNotificationReadDeleteStatusCode = action.payload.statusCode;
        state.chatroomNotificationReadDeleteRoomId = action.payload.chatroomId;
        state.chatroomNotificationReadDeleteAdminId = action.payload.adminId;
      })
      .addCase(deleteAllChatroomNotifications.pending, (state) => {
        state.chatroomNotificationReadDeleteLoading = true;
      })
      .addCase(deleteAllChatroomNotifications.fulfilled, (state, action) => {
        state.chatroomNotificationReadDeleteLoading = false;
        state.chatroomNotificationReadDeleteMessage = action.payload.message;
        state.chatroomNotificationReadDeleteStatusCode = action.payload.statusCode;
        state.chatroomNotificationReadDeleteRoomId = action.payload.chatroomId;
        state.chatroomNotificationReadDeleteAdminId = action.payload.adminId;
      })
      .addCase(deleteAllChatroomNotifications.rejected, (state, action) => {
        state.chatroomNotificationReadDeleteLoading = false;
        state.chatroomNotificationReadDeleteMessage = action.payload.message;
        state.chatroomNotificationReadDeleteStatusCode = action.payload.statusCode;
        state.chatroomNotificationReadDeleteRoomId = action.payload.chatroomId;
        state.chatroomNotificationReadDeleteAdminId = action.payload.adminId;
      });
  }
}
);
export const { reset, toastReset, resetState } = userSlice.actions;
export default userSlice.reducer;
