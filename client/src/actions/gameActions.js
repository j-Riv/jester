import axios from 'axios';
import { reset } from 'redux-form';
import { 
    ADD_CHAT,
    CURRENT_GAME,
    ALL_GAMES
} from './types';

export const addMessage = (formProps, callback) => async dispatch => {
    console.log('Add_Chat');
    console.log(formProps);
    // no saving to mongo
    // this might change
    dispatch({ type: ADD_CHAT, payload: formProps });
    dispatch(reset('chat'));
    callback();
};

export const createGame = (formProps, callback) => async dispatch => {
    try {
        const response = await axios.post(
            'http://localhost:3001/games/new',
            formProps
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
            'http://localhost:3001/games/game/' + id
        );
        console.log('got game?');
        dispatch({ type: CURRENT_GAME, payload: response.data.game });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const getAllGames = (callback) => async dispatch => {
    try {
        const response = await axios.get(
            'http://localhost:3001/games/all/'
        );
        console.log('all games -->');
        console.log(response.data.games);
        dispatch({ type: ALL_GAMES, payload: response.data.games });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}