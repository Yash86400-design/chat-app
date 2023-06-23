import axios from 'axios';
import userService from './userService';
// import userService from './userService';

const API_URL = 'http://localhost:5000/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  // if (response.data) {
  // localStorage.setItem('user', JSON.stringify(response.data));
  //   return response.data;
  // }

  return response.data;
};

// Signin user
const signin = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  let tokenValue, userProfileValue;

  if (response.data) {
    const token = response.data.token_value;
    localStorage.setItem('userToken', JSON.stringify(response.data));
    // localStorage.setItem('messages', {}); // Wrong way to set empty braces...
    localStorage.setItem('messages', JSON.stringify({})); // Just to set empty now so that when user fetched data later I'll store them inside...
    userService.updateToken();
    userProfileValue = await userService.signedUser();
    tokenValue = token;
  }

  return {
    token: tokenValue,
    userProfile: userProfileValue
  };
};

// Logout user
const logout = async () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('messages');
  userService.clearToken();
};

const authService = { register, signin, logout };

export default authService;

