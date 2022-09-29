import axios from 'axios';

import { authActions } from './auth-slice';

export const calculateRemainingTime = expirationTime => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

let logoutTimer;
export const sendUserData = userData => {
  return async dispatch => {
    return axios
      .post('http://127.0.0.1:8080/auth/login', {
        email: userData.email,
        password: userData.password,
      })
      .then(response => {
        dispatch(
          authActions.login({
            token: response.data.token,
            isLoggedIn: true,
            email: response.data.email,
            name: response.data.name,
            userId: response.data.userId,
          })
        );

        const timer = new Date(
          new Date().getTime() + 60 * 60 * 1000
        ).toISOString(); // 1 hour
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('expirationTime', timer);
        localStorage.setItem('userId', response.data.userId);

        logoutTimer = setTimeout(() => {
          dispatch(authActions.logout());
        }, calculateRemainingTime(timer));
        return response;
      })
      .catch(err => {
        // TODO: handle error here, maybe wrong pass or something
        console.log(err.response.data.message);
        return err.response;
      });
  };
};

export default logoutTimer;
