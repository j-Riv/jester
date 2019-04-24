import axios from 'axios';
import { reset } from 'redux-form';
import hostname from '../config/config';
import {
    ADD_CHAT,
    CURRENT_GAME,
    GET_ALL_GAMES,
    ALL_GAMES,
    GET_GIFS,
    UPDATE_USERS,
    UPDATE_CURRENT_TURN,
    UPDATE_WINNER,
    SET_PHRASE,
    UPDATE_AND_RESET
} from './types';
import io from 'socket.io-client';
import words from '../words/words-clean';
import Phrases from '../words/Phrases';

const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

export const setUserGifs = (gameType) => async dispatch => {
    let word = [];
    try {
        if (gameType === 'Safe For Work') {
            for (let i = 0; i < 3; i++) {
                word.push(words.clean[~~(Math.random() * words.clean.length)])
            }
        } else if (gameType === 'Not Safe For Work') {
            for (let i = 0; i < 3; i++) {
                word.push(words.dirty[~~(Math.random() * words.dirty.length)])
            }
        }
        let gifs = [];
        for (let i = 0; i < 3; i++) {
            const gif = await axios.get(
                `https://api.giphy.com/v1/gifs/random?tag=${word[i]}&rating=r&api_key=kygFzz8jXFLD2kI2IsPll2kxWJjTeKxZ&limit=1`
            )
            gifs.push(gif.data.data.images.fixed_width.webp);
        }
        dispatch({ type: GET_GIFS, payload: gifs })
    } catch (e) {
        console.log(e)
    }
};

export const addMessage = (formProps, callback) => async dispatch => {
    dispatch({ type: ADD_CHAT, payload: formProps });
    dispatch(reset('chat'));
    callback();
};

export const createGame = (formProps, callback) => async () => {
    // create game
    try {
        const response = await axios.post(
            hostname + '/games/new',
            formProps
        );
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const getGame = (id, callback) => async dispatch => {
    // get current game
    try {
        const response = await axios.get(
            hostname + '/games/game/' + id
        );
        localStorage.setItem('game', response.data.game);
        dispatch({ type: CURRENT_GAME, payload: response.data.game });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

export const getAllGames = () => async dispatch => {
    try {
        const response = await axios.get(
            hostname + '/games/all/'
        );
        // get all games
        dispatch({ type: GET_ALL_GAMES });
        dispatch({ type: ALL_GAMES, payload: response.data.games });
    } catch (e) {
        console.log(e);
    }
}

export const addUser = (user, userId, gameId, callback) => async dispatch => {
    // add user to room
    try {
        const response = await axios.post(
            hostname + '/games/add/users',
            { user, userId, gameId }
        );
        // add user
        dispatch({ type: UPDATE_USERS, payload: response.data.added });
        callback(response.data.added);
    } catch (e) {
        console.log(e);
    }
}

export const removeUser = (user, gameId, nextUser, callback) => async dispatch => {
    // remove user from room
    try {
        const response = await axios.post(
            hostname + '/games/remove/users',
            { user, gameId, nextUser }
        );
        // remove user
        dispatch({ type: UPDATE_CURRENT_TURN, payload: response.data.removed.nextUser });
        callback(response.data.removed.user);
    } catch (e) {
        console.log(e);
    }
}

export const setCurrentTurn = (user, gameId, gameType) => async dispatch => {
    // get phrase
    let phrase = ''
    if (gameType === 'Safe For Work') {
        phrase = Phrases.clean[~~(Math.random() * Phrases.clean.length)];
    } else if (gameType === 'Not Safe For Work') {
        phrase = Phrases.dirty[~~(Math.random() * Phrases.dirty.length)];
    } else {
        phrase = Phrases.clean[~~(Math.random() * Phrases.clean.length)];
    }

    try {
        const response = await axios.post(
            hostname + '/games/game/turn',
            { user, gameId, phrase }
        );
        // set current turn to response from server
        dispatch({ type: UPDATE_CURRENT_TURN, payload: response.data.turn });
        dispatch({ type: SET_PHRASE, payload: response.data.phrase });
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
            hostname + '/games/update/cards',
            card
        );
        console.log('updated cards');
        console.log(response.data.card);
    } catch (e) {
        console.log(e);
    }
}

export const winnerChosen = (winnerData, gameType) => async () => {
    // get phrase
    let type;
    gameType === 'Safe For Work' ? type = Phrases.clean : Phrases.dirty;
    let phrase = type[~~(Math.random() * type.length)];
    
    
    // if (gameType === 'Safe For Work') {
    //     phrase = Phrases.clean[~~(Math.random() * Phrases.clean.length)];
    // } else if (gameType === 'Not Safe For Work') {
    //     phrase = Phrases.dirty[~~(Math.random() * Phrases.dirty.length)];
    // } else {
    //     phrase = Phrases.clean[~~(Math.random() * Phrases.clean.length)];
    // }
    winnerData.phrase = phrase;

    try {
        const response = await axios.post(
            hostname + '/games/update/winner',
            winnerData
        );
        console.log('updated winner');
        console.log(response.data.winner);
    } catch (e) {
        console.log(e);
    }
}

export const afterWin = (r, callback) => async dispatch => {
    const wObj = {
        user: r.user,
        card: r.card
    };
    dispatch({ type: UPDATE_WINNER, payload: wObj });
    // reset game
    setTimeout(() => {
        const rObj = {
            user: r.user,
            phrase: r.phrase,
            nextUser: r.nextUser
        }
        dispatch({ type: UPDATE_AND_RESET, payload: rObj });
    }, 3000);
    callback('after win has run');
}
