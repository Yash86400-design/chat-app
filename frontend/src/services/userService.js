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
  try {
    const response = await axios.get(API_URL + `personal-chat/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    // const allMessages = response.data;
    console.log(response.data);

    // Retrieve existing 'message' object from localstorage
    const existingMessageString = localStorage.getItem('messages');
    console.log(existingMessageString);
    const existingMessageObj = existingMessageString ? JSON.parse(existingMessageString) : {};

    // Update the object with the new key-value pair(s)
    existingMessageObj[userId] = [response.data];
    console.log(existingMessageObj);

    // Convert the updated object back into a JSON string
    const updatedMessageString = JSON.stringify(existingMessageObj);

    // Store the updated JSON string in localStorage
    localStorage.setItem('messages', updatedMessageString);
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
    return response.data.messages;
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

// const userService = { signedUser, userInfo, editInfo };
const userService = { signedUser, editInfo, fetchSuggestedTerms, userInfo, groupInfo, fetchUserMessages, fetchGroupMessages, messageSendToUser, messageSendToChatroom, clearToken, updateToken };

export default userService;
