import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile/';

// Get userToken from localstorage
let userToken = JSON.parse(localStorage.getItem('userToken'))?.token_value || null;
// console.log(userToken.token_value);

// User data
const signedUser = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  });
  // console.log(response);
  if (response.data) {
    localStorage.setItem("userProfile", JSON.stringify(response.data));
  }
  return response.data;
};

// To Clear The Token Value From Slice When The User Log Out
const clearToken = () => {
  userToken = null;
};

// Filling the token back when user sign in
const updateToken = () => {
  userToken = JSON.parse(localStorage.getItem('userToken')).token_value;
};

// User Info
// const userInfo = async () => {
//   const response = await axios.get(API_URL + 'view-profile/', {
//     headers: {
//       Authorization: `Bearer ${userToken}`
//     }
//   });

//   if (response.data) {
//     localStorage.setItem("userProfileInfo", JSON.stringify(response.data));
//   }
//   return response.data;
// };

// Editing User Info
const editInfo = async (userData) => {
  const response = await axios.patch(API_URL + 'view-profile/edit', userData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  console.log(response.data);
  return response.data;
};

const fetchSuggestedTerms = async (partialQuery) => {
  try {
    const response = await axios.get(API_URL + 'search', {
      params: {
        q: partialQuery
      },
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('Error fetching suggested terms:', error);
    return [];
  }
};

const userInfo = async (userId) => {
  try {
    const response = await axios.get(API_URL + `user/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.log('Error fetching user detail:', error);
  }
};

const groupInfo = async (groupId) => {
  try {
    const response = await axios.get(API_URL + `group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.log('Error fetching user detail:', error);
  }
};

const fetchUserMessages = async (userId) => {
  console.log(userId);
  try {
    const response = await axios.get(API_URL + `personal-chat/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    // const allMessages = response.data;
    // console.log(response.data);

    // // Retrieve existing 'message' object from localstorage
    // const existingMessageString = localStorage.getItem('messages');
    // // console.log(existingMessageString);
    // const existingMessageObj = existingMessageString ? JSON.parse(existingMessageString) : {};

    // // Update the object with the new key-value pair(s)
    // existingMessageObj[userId] = response.data;
    // // console.log(existingMessageObj);

    // // Convert the updated object back into a JSON string
    // const updatedMessageString = JSON.stringify(existingMessageObj);

    // // Store the updated JSON string in localStorage
    // localStorage.setItem('messages', updatedMessageString);

    return response.data;
  } catch (error) {
    console.log('Error fetching messages:', error);
  }
};

const fetchGroupMessages = async (groupId) => {
  try {
    const response = await axios.get(API_URL + `chatroom/${groupId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    // Retrieve existing 'message' object from localstorage
    // const existingMessageString = localStorage.getItem('messages');
    // const existingMessageObj = existingMessageString ? JSON.parse(existingMessageString) : {};

    // // Update the object with the new key-value pair(s)
    // existingMessageObj[groupId] = response.data.messages;

    // // Convert the updated object back into a JSON string
    // const updatedMessageString = JSON.stringify(existingMessageObj);
    // localStorage.setItem('messages', updatedMessageString);
    return response.data;
  } catch (error) {
    console.log('Error fetching messages:', error);
  }
};

const messageSendToUser = async (userId, message) => {
  try {
    const response = await axios.post(API_URL + `personal-chat/${userId}`, { message: message }, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return response.data.message;
  } catch (error) {
    console.error(error);
    console.log('Error sending message:', error);
  }
};

const messageSendToChatroom = async (chatroomId, message) => {
  try {
    const response = await axios.post(API_URL + `chatroom/${chatroomId}`, { message: message }, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data.message;
  } catch (error) {
    console.error(error);
    console.log('Error sending message:', error);
  }
};

const createChatroomResponse = async (formData) => {
  try {
    const response = await axios.post(API_URL + `new-chatroom`, formData, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    console.log('Error sending message:', error);
  }
};

const joinRequest = async (requiredData) => {
  // Here I will separate the requests, one for user and one for chatroom....
  try {
    if (requiredData.type === 'User') {

      const response = await axios.post(API_URL + `personal-chat/${requiredData.id}/request`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      return response.data.message;
    } else if (requiredData.type === 'Chatroom') {
      const response = await axios.post(API_URL + `chatroom/${requiredData.id}/request`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      return response.data.message;
    }

  } catch (error) {
    console.error(error);
    return 'Error in Adding Request';
  }
};

const friendRequestAccept = async (requiredData) => {
  try {

    // Now receiver will become sender and sender will become receiver. Cause notification is saved based on who sended the notification to whom. So if your someone sent you friend request then they are sender in your notification and you are receiver. And now when you want to accept request so you will use senderId to find that person...

    const response = await axios.get(API_URL + `notifications/requests/${requiredData.notificationId}/${requiredData.senderId}/accept`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return { message: response.message, statusCode: response.status };
  } catch (error) {
    console.error(error);
    // console.log('Error ');
    return { message: 'Error Adding Friend', statusCode: 500 };
  }
};

const friendRequestReject = async (requiredData) => {
  try {
    const response = await axios.get(API_URL + `notifications/requests/${requiredData.notificationId}/${requiredData.senderId}/reject`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return { message: response.message, statusCode: response.status };
  } catch (error) {
    console.error(error);
    return { message: 'Error Rejecting Friend Request', statusCode: 500 };
  }
};

const groupJoinRequestAccepted = async (requiredData) => {
  try {
    const response = await axios.put(API_URL + `chatroom/${requiredData.chatroomId}/requests/${requiredData.notificationId}/${requiredData.senderId}/accept`,{}, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return { message: response.message, statusCode: response.status };
  } catch (error) {
    console.error(error);
    return { message: 'Error in Joining Member', statusCode: 500 };
  }
};

const groupJoinRequestRejected = async (requiredData) => {
  try {
    const response = await axios.put(API_URL + `chatroom/${requiredData.chatroomId}/requests/${requiredData.notificationId}/${requiredData.senderId}/reject`, {}, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return { message: response.message, statusCode: response.status };
  } catch (error) {
    console.error(error);
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
    console.error(error);
    throw error;
  }
};

// const userService = { signedUser, userInfo, editInfo };
const userService = { signedUser, editInfo, fetchSuggestedTerms, userInfo, groupInfo, fetchUserMessages, fetchGroupMessages, messageSendToUser, messageSendToChatroom, createChatroomResponse, friendRequestAccept, friendRequestReject, joinRequest, groupJoinRequestAccepted, groupJoinRequestRejected, fetchChatroomInfo, clearToken, updateToken };

export default userService;
