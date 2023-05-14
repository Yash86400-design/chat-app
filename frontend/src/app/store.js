import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import registerReducer from '../features/registerSlice';
import loginReducer from '../features/loginSlice';
import logoutReducer from '../features/logoutSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // register: registerReducer,
  // login: loginReducer,
  // logout: logoutReducer,
});

const store = configureStore({
  reducer: rootReducer
});

export default store;