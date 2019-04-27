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

/**
 * Creates a new user.
 * @param {Object} formProps - form object
 * @param {string} formProps.email - email
 * @param {string} formProps.username - username
 * @param {string} formProps.password - password
 * @param {function} callback - the function to run on success
 */
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

/**
 * Signs the user in and saves the JSON Web Token to local storage.
 * @param {Object} formProps - form object
 * @param {string} formProps.email - email
 * @param {string} formProps.password - password
 * @param {function} callback 
 */
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

/**
 * Gets user from the DB using the api.
 * @param {string} userToken - JSON Web Token used for authentication
 */
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

/**
 * Signs out the current user and deletes the users token from local storage.
 */
export const signout = () => async dispatch => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: CURRENT_USER, payload: '' });
    dispatch({ type: AUTH_USER, payload: '' });
};

/**
 * Updates the users picture using the api.
 * @param {Object} formProps 
 * @param {string} formProps.picture - users new picture
 */
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

/**
 * Sets or updates state to display the sign in modal.
 * @param {boolean} display - used to display sign in modal
 */
export const showSignin = display => async dispatch => {
    dispatch({ type: SHOW_SIGNIN, payload: display });
}