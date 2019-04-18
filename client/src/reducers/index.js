import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import lobby from './lobby';
import currentUser from './currentUser';
import game from './game';

export default combineReducers({
    auth,
    form: formReducer,
    lobby,
    currentUser,
    game
});