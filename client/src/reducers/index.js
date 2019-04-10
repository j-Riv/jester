import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import color from './color';
import chat from './chat';
import currentUser from './currentUser';

export default combineReducers({
    auth,
    form: formReducer,
    color,
    chat,
    currentUser
});