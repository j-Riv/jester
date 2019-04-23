import axios from 'axios';
import host from '../config/config';
import { 
    AUTH_USER, 
    AUTH_ERROR, 
    CURRENT_USER,
    SHOW_SIGNIN,
    UPDATE_PICTURE
} from './types';


export const signup = (formProps, callback) => async dispatch => {
    try {
        const response = await axios.post(
            host + '/signup',
            formProps
        );

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
        const response = await axios.post(
            host + '/signin',
            formProps
        );

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

export const getCurrentUser = (userToken, callback) => async dispatch => {
    try {
        const response = await axios.get(
            host + '/users/current/' + userToken
        );
        dispatch({ type: CURRENT_USER, payload: response.data.currentUser });
        callback(response.data.currentUser);
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
        const response = await axios.post(
            host + '/users/update',
            formProps
        );
        dispatch({ type: UPDATE_PICTURE, payload: response.data.picture });
    } catch (e) {
        console.log(e);
    }
}

export const showSignin = display => async dispatch => {
    dispatch({ type: SHOW_SIGNIN, payload: display });
}