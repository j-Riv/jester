import { AUTH_USER, AUTH_ERROR, SHOW_SIGNIN } from '../actions/types';

const INITIAL_STATE = {
    authenticated: localStorage.getItem('token'),
    errorMessage: '',
    showSignin: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUTH_USER:
            return { 
                ...state, 
                authenticated: action.payload 
            };
        case AUTH_ERROR:
            return { 
                ...state, 
                errorMessage: action.payload 
            };
        case SHOW_SIGNIN:
            return {
                ...state,
                showSignin: action.payload
            };
        default:
            return state;
    }
}