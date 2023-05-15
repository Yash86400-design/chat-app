import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userReducer,
});

const store = configureStore({
  reducer: rootReducer
});

export default store;