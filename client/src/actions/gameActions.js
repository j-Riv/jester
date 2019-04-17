import axios from 'axios';
import { reset } from 'redux-form';
import host from '../config/config';
import { 
    ADD_CHAT,
    CURRENT_GAME,
    GET_ALL_GAMES,
    ALL_GAMES,
    GET_GIFS,
    USER_GIFS,
    UPDATE_USERS
} from './types';
import io from 'socket.io-client';

const socket = io(host, {
    transports: ['websocket'],
    secure: true
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

export const createGame = (formProps, callback) => async () => {
    try {
        const response = await axios.post(
            host + '/games/new',
            formProps
        );
        console.log('created game?');
        console.log(response.data);
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const getGame = (id, callback) => async dispatch => {
    try {
        const response = await axios.get(
            host + '/games/game/' + id
        );
        console.log('got game?');
        localStorage.setItem('game', response.data.game);
        dispatch({ type: CURRENT_GAME, payload: response.data.game });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const getAllGames = (callback) => async dispatch => {
    try {
        const response = await axios.get(
            host + '/games/all/'
        );
        console.log('all games -->');
        console.log(response.data.games);
        dispatch({ type: GET_ALL_GAMES });
        dispatch({ type: ALL_GAMES, payload: response.data.games });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const updateGameUsers = (user, gameId, callback) => async dispatch => {
    console.log(`Add user: ${user} to room: ${gameId}!`);
    try {
        const response = await axios.post(
            host + '/games/update/users',
            {user, gameId}
        );
        console.log('updateGameusers');
        console.log(response.data.updatedGame.users);
        dispatch({ type: UPDATE_USERS, payload: response.data.updatedGame });
        callback(response.data.updatedGame);
    } catch (e) {
        console.log(e);
    }
}

export const imgCardChosen = card => async () => {
    console.log('Card info:');
    console.log(card);
    socket.emit('card selected', card);
    try {
        const response = await axios.post(
            host + '/games/update/cards',
            card
        );
        console.log('updateCards');
        console.log(response.data.updatedGame.images);
        // dispatch({ type: UPDATE_IMAGES, payload: response.data.updatedGame.images });
    } catch (e) {
        console.log(e);
    }
}

export const winnerChosen = card => async () => {
    console.log('Card info:');
    console.log(card);
    socket.emit('winning card', card);
    try {
        const response = await axios.post(
            host + '/games/update/winner',
            card
        );
        console.log('updateWinner');
        console.log(response.data.winner);
    } catch (e) {
        console.log(e);
    }
}