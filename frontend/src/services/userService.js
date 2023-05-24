import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile/';

// Get userToken from localstorage
const userToken = JSON.parse(localStorage.getItem('userToken')).token_value;
// console.log(userToken.token_value);

// User data
const signedUser = async (tokenFromAuthentication) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${tokenFromAuthentication}`
    }
  });
  // console.log(response);
  if (response.data) {
    localStorage.setItem("userProfile", JSON.stringify(response.data));
  }
  return response.data;
};

// User Info
const userInfo = async () => {
  const response = await axios.get(API_URL + 'view-profile/', {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  });

  if (response.data) {
    localStorage.setItem("userProfileInfo", JSON.stringify(response.data));
  }
  return response.data;
};

// Editing User Info
const editInfo = async (userData) => {
  const response = await axios.patch(API_URL + 'view-profile/edit', userData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  if (response.data) {
    console.log(response.data);
  }
};

const userService = { signedUser, userInfo, editInfo };

export default userService;