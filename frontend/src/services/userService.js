import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile/';

// Get userToken from localstorage
const userToken = JSON.parse(localStorage.getItem('userToken')) ? JSON.parse(localStorage.getItem('userToken')).token_value : null;
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

const userService = { signedUser };

export default userService;