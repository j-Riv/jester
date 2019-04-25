import axios from 'axios';
import store from '../store';
import hostname from '../config/config';
import { 
    AUTH_USER, 
    AUTH_ERROR, 
    CURRENT_USER,
    SHOW_SIGNIN,
    UPDATE_PICTURE
} from './types';

export const signup = (formProps, callback) => async dispatch => {
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/signup',
            data: formProps
        });

        dispatch({ type: AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        // current user
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser });
        localStorage.setItem('user', response.data.currentUser);
        callback();
    } catch (e) {
        dispatch({ type: AUTH_ERROR, payload: 'Email or Username in use' });
    }
};

export const signin = (formProps, callback) => async dispatch => {
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/signin',
            data: formProps
        });

        dispatch({ type: AUTH_USER, payload: response.data.token });
        localStorage.setItem('token', response.data.token);
        // current user
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser});
        localStorage.setItem('user', response.data.currentUser);
        callback();
    } catch (e) {
        dispatch({ type: AUTH_ERROR, payload: 'Invalid login credentials' });
    }
};

export const getCurrentUser = userToken => async dispatch => {
    try {
        const response = await axios({
            method: 'GET',
            url: hostname + '/users/current/' + userToken,
            headers: { authorization: store.getState().auth.authenticated }
        });
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser });
    } catch (e) {
        console.log(e);
    }
}

export const signout = () => async dispatch => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: CURRENT_USER, payload: '' });
    dispatch({ type: AUTH_USER, payload: '' });
};

export const updateUser = formProps => async dispatch => {
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/users/update',
            data: formProps,
            headers: { authorization: store.getState().auth.authenticated }
        });
        dispatch({ type: UPDATE_PICTURE, payload: response.data.picture });
    } catch (e) {
        console.log(e);
    }
}

export const showSignin = display => async dispatch => {
    dispatch({ type: SHOW_SIGNIN, payload: display });
}