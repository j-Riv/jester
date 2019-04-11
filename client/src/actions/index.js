import axios from 'axios';
import io from 'socket.io-client';
import { 
    AUTH_USER, 
    AUTH_ERROR, 
    ADD_CHAT, 
    CURRENT_USER,
    CURRENT_GAME
} from './types';

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
        dispatch({ type: AUTH_ERROR, payload: 'Email or Username in use' });
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

export const signout = () => async dispatch => {
    localStorage.removeItem('token');
    dispatch({ type: CURRENT_USER, payload: '' });
    dispatch({ type: AUTH_USER, payload: '' });
};

export const addMessage = (formProps, callback) => async dispatch => {
    console.log('Add_Chat');
    console.log(formProps);
    // no saving to mongo
    // this might change
    dispatch({ type: ADD_CHAT, payload: formProps });

    const socket = io('http://localhost:3001');
    socket.emit('new message', formProps);
    callback();
};

export const updateUser = formProps => async dispatch => {
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

export const createGame = callback => async dispatch => {
    try {
        const response = await axios.get(
            'http://localhost:3001/games/new'
        );
        console.log('created game?');
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const getGame = (id, callback) => async dispatch => {
    try {
        const response = await axios.get(
            'http://localhost:3001/games/' + id
        );
        console.log('got game?');
        dispatch({ type: CURRENT_GAME, payload: response.data.game });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}