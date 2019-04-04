import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import color from './color';

export default combineReducers({
    auth,
    form: formReducer,
    color
});