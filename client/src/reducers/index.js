import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import color from './color';
import lobby from './lobby';
import currentUser from './currentUser';
import game from './game';

export default combineReducers({
    auth,
    form: formReducer,
    color,
    lobby,
    currentUser,
    game
});