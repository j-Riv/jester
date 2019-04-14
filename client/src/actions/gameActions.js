import axios from 'axios';
import { reset } from 'redux-form';
import { 
    ADD_CHAT,
    CURRENT_GAME,
    ALL_GAMES,
    GET_GIFS,
    USER_GIFS,
    UPDATE_USERS
} from './types';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
    transports: ['websocket']
});

export const getGifs = (word, callback) => async dispatch => {
    try {
        const response = await axios.get(
            `https://api.tenor.com/v1/search?tag=${word}&limit=7&media_filter=minimal&key=OZVKWPE1OFF3`
        )
        dispatch({ type: GET_GIFS, payload: response.data.results })
        // callback(response)
        console.log('============================================')
        console.log(response.data.results)
    } catch (e) {
        // dispatch({ e })
        console.log(e)
    }
};

export const setUserGifs = (word, callback) => async dispatch => {
    try {
        const response = await axios.get(
            `https://api.tenor.com/v1/search?tag=${word}&limit=7&media_filter=minimal&key=OZVKWPE1OFF3`
        )
        dispatch({ type: USER_GIFS, payload: response.data.results })
        callback(response.data.results);
    } catch (e) {
        // dispatch({ e })
        console.log(e)
    }
};

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
        console.log(response.data);
        localStorage.setItem('game', response.data);
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

export const updateGameUsers = data => async dispatch => {
    console.log('Add these users');
    console.log(data);
    try {
        const response = await axios.post(
            'http://localhost:3001/games/update/users',
            data
        );
        console.log('updateGameusers');
        console.log(response.data.updatedGame.users);
        dispatch({ type: UPDATE_USERS, payload: response.data.updatedGame.users });
    } catch (e) {
        console.log(e);
    }
}

export const imgCardChosen = card => async dispatch => {
    console.log('Card info:');
    console.log(card);
    socket.emit('card selected', card);
    try {
        const response = await axios.post(
            'http://localhost:3001/games/update/cards',
            card
        );
        console.log('updateCards');
        // console.log(response.data.updatedGame);
        // dispatch({ type: UPDATE_USERS, payload: response.users });
    } catch (e) {
        console.log(e);
    }
}