import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, ADD_CHAT, CURRENT_USER } from './types';

export const signup = (formProps, callback) => async dispatch => {
    try {
        const response = await axios.post(
            'http://localhost:3001/signup',
            formProps
        );

        dispatch({ type: AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        // current user
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser });
        callback();
    } catch (e) {
        dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
    }
};

export const signin = (formProps, callback) => async dispatch => {
    try {
        const response = await axios.post(
            'http://localhost:3001/signin',
            formProps
        );

        dispatch({ type: AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        // current user
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser});
        callback();
    } catch (e) {
        dispatch({ type: AUTH_ERROR, payload: 'Invalid login credentials' });
    }
};

export const getCurrentUser = userToken => async dispatch => {
    try {
        const response = await axios.get(
            'http://localhost:3001/users/current/' + userToken
        );
        console.log('Response');
        console.log(response.data);
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser });
    } catch (e) {
        console.log(e);
    }
}

export const signout = () => async dispatch =>{
    localStorage.removeItem('token');
    dispatch({ type: CURRENT_USER, payload: '' });
    dispatch({ type: AUTH_USER, payload: '' });
};

export const addMessage = (formProps) => async dispatch => {
    console.log('Add_Chat');
    console.log(formProps);
    dispatch({ type: ADD_CHAT, payload: formProps });
};

export const updateUser = (formProps) => async dispatch => {
    try {
        const response = await axios.post(
            'http://localhost:3001/users/update',
            formProps
        );
        console.log(formProps);
        console.log('updated user');
        console.log(response.data.currentUser);
        // current user
        // dispatch({ type: CURRENT_USER, payload: response.data.currentUser });
        // callback();
    } catch (e) {
        console.log(e);
    }
}