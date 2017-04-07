import axios from 'axios';
import fetch from 'isomorphic-fetch';
import { hashHistory } from 'react-router';
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR,
        GET_USER_INFO } from './types.jsx';

export const axiosInstance = axios.create({
  baseURL: 'http://b78f8e4a.ngrok.io'
});

export function signinUser({ email, password }) {
  console.log("Calling signinUser");
  return function (dispatch) {
    axiosInstance.post('/api/login', { 'Email': email, 'Password': password })
      .then(response => {
        console.log("successfully sign in an user and receive token as ", response.data);
        dispatch({ type: AUTH_USER, payload: email });
        localStorage.setItem('token', response.data);
        localStorage.setItem('user_email', email);
        hashHistory.push('/home');
      })
      .catch(error => {
        console.error("fail to sign in an user with error ", error);
        dispatch({ type: AUTH_ERROR, payload: error });
      })
  }
}

export function signupUser(signupObj) {
  console.log("Calling signupUser", signupObj);
  return function (dispatch) {
    axiosInstance.post('/api/signup', signupObj)
      .then(response => {
        console.log("successfully sign up an user and receive token as ", response.data);
        dispatch({ type: AUTH_USER, payload: signupObj.email });
        localStorage.setItem('token', response.data);
        localStorage.setItem('user_email', email);
        hashHistory.push('/home');
      })
      .catch(error => {
        console.error("fail to sign in an user with error ", error);
        dispatch({ type: AUTH_ERROR, payload: error });
      })
  }
}

export function getUserInfo(token, email) {
  return function (dispatch) {
    dispatch({ type: AUTH_USER })
    axiosInstance.get('/api/token', {
      headers: {
        Token: token,
        Email: email
      }
    })
      .then(res => {
        console.log('base on token and email, getUser object ', res.data);
        dispatch({ type: GET_USER_INFO, payload: {
          email: email,
          data: res.data
        }})
      })
      .catch(err => {
        console.error('Fail to getUserInfo with error ', err);
      })
  }
}