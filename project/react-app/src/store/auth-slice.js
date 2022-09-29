import { createSlice } from '@reduxjs/toolkit';

import logoutTimer, { calculateRemainingTime } from './auth-actions';

const initialState = {
  token: '',
  isLoggedIn: false,
  email: '',
  name: '',
  userId: '',
};

const _cleanStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('expirationTime');
  localStorage.removeItem('userId');

  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.userId = action.payload.userId;
    },
    logout(state) {
      state.token = '';
      state.isLoggedIn = false;
      state.email = '';
      state.name = '';

      _cleanStorage();
    },
    checkExist(state) {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const expirationTime = localStorage.getItem('expirationTime');
      const userId = localStorage.getItem('userId');

      // check if we have existing token and the remaining time bigger then 1 min
      if (token != null && calculateRemainingTime(expirationTime) > 60 * 1000) {
        state.token = token;
        state.isLoggedIn = true;
        state.email = email;
        state.name = name;
        state.userId = userId;
      } else {
        state.token = '';
        state.isLoggedIn = false;
        state.email = '';
        state.name = '';
        state.userId = '';
        _cleanStorage();
      }
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
