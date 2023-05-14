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

const signin = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const authService = { register, signin };

export default authService;