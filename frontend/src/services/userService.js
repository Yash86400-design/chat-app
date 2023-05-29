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

    return response.data.suggestedTerms;
  } catch (error) {
    console.log('Error fetching suggested terms:', error);
    return [];
  }
};

// const userService = { signedUser, userInfo, editInfo };
const userService = { signedUser, editInfo, fetchSuggestedTerms, clearToken, updateToken };

export default userService;
