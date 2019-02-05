import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
  };
};

export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => dispatch(authLogout()), expirationTime * 1000);
  };
}

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBGSq9gwvOGkFEvJwcsdcYvB-OjMRNk4yc';
    if (!isSignup) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBGSq9gwvOGkFEvJwcsdcYvB-OjMRNk4yc'
    }
    axios
      .post(
        url,
        { email, password, returnSecureToken: true }
      )
      .then(response => {
        console.log(response);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', new Date(Date.now() + response.data.expiresIn * 1000 ));
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path,
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      authLogout();
    } else {
      const expiresIn = Math.floor(new Date(localStorage.getItem('expirationDate')).getTime() - Date.now()) / 1000;
      const userId = localStorage.getItem('userId');
      dispatch(authSuccess(token, userId));
      dispatch(checkAuthTimeout(expiresIn));
    }
  }
};