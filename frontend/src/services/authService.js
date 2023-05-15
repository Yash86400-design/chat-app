import axios from 'axios';

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

  if (response.data) {
    localStorage.setItem('userToken', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = async () => {
  localStorage.removeItem('userToken');
};

const authService = { register, signin, logout };

export default authService;