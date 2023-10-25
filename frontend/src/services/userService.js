import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile/';
let userToken = JSON.parse(localStorage.getItem('userToken'))?.token_value || null;

const signedUser = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    if (response.data) {
      localStorage.setItem('userProfile', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Error during signedUser:', error);
    throw error;
  }
};

const clearToken = () => {
  userToken = null;
};

const updateToken = () => {
  userToken = JSON.parse(localStorage.getItem('userToken')).token_value;
};

const editInfo = async (userData) => {
  try {
    const response = await axios.patch(API_URL + 'view-profile/edit', userData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Success');

    return { message: response.data.message, statusCode: response.status, userId: response.data.editProfileSuccessUserId };
  } catch (error) {
    // console.error('Error during editInfo:', error);
    // throw error;
    if (error.response) {
      // toast.error(error.response.data.message);
      return {
        message: error.response.data.message || 'Unknown error',
        statusCode: error.response.status || 500
      };
    } else {
      // If the error is not an HTTP response (e.g., a network error)
      return {
        message: 'Network error or server unreachable',
        statusCode: 500
      };
    }
  }
};

const fetchSuggestedTerms = async (partialQuery) => {
  try {
    const response = await axios.get(API_URL + 'search', {
      params: { q: partialQuery },
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching suggested terms:', error);
    return [];
  }
};

const userInfo = async (userId) => {
  try {
    const response = await axios.get(API_URL + `user/${userId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user detail:', error);
    throw error;
  }
};

const groupInfo = async (groupId) => {
  try {
    const response = await axios.get(API_URL + `group/${groupId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching group detail:', error);
    throw error;
  }
};

const fetchUserMessages = async (userId) => {
  try {
    const response = await axios.get(API_URL + `personal-chat/${userId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

const fetchGroupMessages = async (groupId) => {
  try {
    const response = await axios.get(API_URL + `chatroom/${groupId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

const messageSendToUser = async (userId, message) => {
  try {
    const response = await axios.post(API_URL + `personal-chat/${userId}`, { message: message }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return {message: response.data, statusCode: response.status };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const messageSendToChatroom = async (chatroomId, message) => {
  try {
    const response = await axios.post(API_URL + `chatroom/${chatroomId}`, { message: message }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return {message: response.data, statusCode: response.status };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const createChatroomResponse = async (formData) => {
  try {
    const response = await axios.post(API_URL + `new-chatroom`, formData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return {
      message: response.data.message, statusCode: response.status
    };
  } catch (error) {
    // console.error('Error creating chatroom:', error);
    // throw error;
    if (error.response) {
      // If the error response contains status code and message
      // toast.error(error.response.data.message);
      return {
        message: error.response.data.message || 'Unknown error',
        statusCode: error.response.status || 500
      };
    } else {
      // If the error is not an HTTP response (e.g., a network error)
      return {
        message: 'Network error or server unreachable',
        statusCode: 500
      };
    }
  }
};

const joinRequest = async (requiredData) => {
  try {
    if (requiredData.type === 'User') {
      const response = await axios.post(API_URL + `personal-chat/${requiredData.id}/request`, {}, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return response.data.message;
    } else if (requiredData.type === 'Chatroom') {
      const response = await axios.post(API_URL + `chatroom/${requiredData.id}/request`, {}, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return response.data.message;
    }
  } catch (error) {
    console.error('Error in adding request:', error);
    return 'Error in Adding Request';
  }
};

const friendRequestAccept = async (requiredData) => {
  try {
    const response = await axios.get(API_URL + `notifications/requests/${requiredData.notificationId}/${requiredData.senderId}/accept`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return { message: response.message, statusCode: response.status };
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return { message: 'Error Adding Friend', statusCode: 500 };
  }
};

const friendRequestReject = async (requiredData) => {
  try {
    const response = await axios.get(API_URL + `notifications/requests/${requiredData.notificationId}/${requiredData.senderId}/reject`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return { message: 'Error Rejecting Friend Request', statusCode: 500 };
  }
};

const groupJoinRequestAccepted = async (requiredData) => {
  try {
    const response = await axios.put(API_URL + `chatroom/${requiredData.chatroomId}/requests/${requiredData.notificationId}/${requiredData.senderId}/accept`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error in joining group:', error);
    return { message: 'Error in Joining Member', statusCode: 500 };
  }
};

const groupJoinRequestRejected = async (requiredData) => {
  try {
    const response = await axios.put(API_URL + `chatroom/${requiredData.chatroomId}/requests/${requiredData.notificationId}/${requiredData.senderId}/reject`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error in rejecting group request:', error);
    return { message: 'Error in Rejecting Member Request', statusCode: 500 };
  }
};

const fetchChatroomInfo = async (requiredData) => {
  try {
    const response = await axios.get(API_URL + `chatroom/${requiredData.id}/info`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chatroom info:', error);
    throw error;
  }
};

// Mark one notification read
const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(API_URL + `notifications/mark-read/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error(`Error marking a notification as read:`, error);
    throw error;
  }
};

// Mark all notification read
const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.patch(API_URL + 'notifications/mark-all-read', {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete all notifications
const deleteAllNotifications = async () => {
  try {
    const response = await axios.delete(API_URL + 'notifications/delete-all',
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error deleting all notifications', error);
    throw error;
  }
};

// UnFriend User
const unfriendUser = async (friendId) => {
  try {
    const response = await axios.post(API_URL + `personal-chat/${friendId}/info/unfriend`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error unfriending this user, Please refresh the page or try again later', error);
    throw error;
  }
};

// Exit chatroom
const exitChatroom = async (chatroomId) => {
  try {
    const response = await axios.delete(API_URL + `chatroom/${chatroomId}/info/leave`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return { message: response.data.message, statusCode: response.status };
  } catch (error) {
    console.error('Error exiting this chatroom, Please refresh the page or try again later', error);
    throw error;
  }
};

const userService = {
  signedUser,
  editInfo,
  fetchSuggestedTerms,
  userInfo,
  groupInfo,
  fetchUserMessages,
  fetchGroupMessages,
  messageSendToUser,
  messageSendToChatroom,
  createChatroomResponse,
  friendRequestAccept,
  friendRequestReject,
  joinRequest,
  groupJoinRequestAccepted,
  groupJoinRequestRejected,
  fetchChatroomInfo,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  unfriendUser,
  exitChatroom,
  clearToken,
  updateToken,
};

export default userService;

