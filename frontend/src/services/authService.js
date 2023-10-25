import axios from 'axios';
import userService from './userService';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/auth/';

const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {
    // Handle errors, e.g., log or notify the user
    console.error('Error during registration:', error);
    throw error; // Re-throw the error for handling at a higher level
  }
};

const signin = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data && response.data.token_value) {
      const token = response.data.token_value;
      localStorage.setItem('userToken', JSON.stringify(response.data));
      localStorage.setItem('messages', JSON.stringify({})); // Initialize with an empty object
      userService.updateToken();
      const userProfileValue = await userService.signedUser();

      return {
        token: token,
        userProfile: userProfileValue,
        message: response.data.message,
      };
    } else {
      throw new Error('Signin response is empty'); // Handle the case when response data is missing
    }
  } catch (error) {
    console.error('Error during signin:', error);
    throw error;
  }
};

const logout = async () => {
  localStorage.removeItem('userProfile');
  localStorage.removeItem('chatroomInfo');
  localStorage.removeItem('userToken');
  localStorage.removeItem('messages');
  userService.clearToken();
};

const authService = { register, signin, logout };

export default authService;
