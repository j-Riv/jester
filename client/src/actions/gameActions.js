import axios from 'axios';
import { reset } from 'redux-form';
import store from '../store';
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

/**
 * Sets user gifs by requesting 3 images from the giphy api.
 */
export const setUserGifs = () => async dispatch => {
    let word = [];
    try {
        for (let i = 0; i < 3; i++) {
            word.push(words.words[~~(Math.random() * words.words.length)])
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

/**
 * Adds message to game state.
 * The callback emits a 'new chat' event via socket.
 * @param {Object} formProps - message object
 * @param {string} formProps.gameId - the games id
 * @param {string} formProps.username - from username
 * @param {string} formProps.message - the message
 * @param {function} callback - the function to run on success
 */
export const addMessage = (formProps, callback) => async dispatch => {
    dispatch({ type: ADD_CHAT, payload: formProps });
    dispatch(reset('chat'));
    callback();
};

/**
 * Creates new game via api.
 * @param {Object} formProps - game object
 * @param {string} current_turn - current turn
 * @param {string} user_pic - users picture
 * @param {string} username - username
 * @param {string} game_name - name of game
 * @param {string} game_category - category of game
 * @param {string} game_status - status of game
 * @param {function} callback - the function to run on success
 */
export const createGame = (formProps, callback) => async () => {
    // create game
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/games/new',
            data: formProps,
            headers: { authorization: store.getState().auth.authenticated }
        });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Gets current game from DB using the api.
 * @param {string} id - game id
 * @param {function} callback - the function to run on success
 */
export const getGame = (id, callback) => async dispatch => {
    // get current game
    try {
        const response = await axios({
            method: 'GET',
            url: hostname + '/games/game/' + id,
            headers: { authorization: store.getState().auth.authenticated }
        });

        localStorage.setItem('game', response.data.game);
        dispatch({ type: CURRENT_GAME, payload: response.data.game });
        callback(response);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Gets all games from DB using the api.
 */
export const getAllGames = () => async dispatch => {
    try {
        const response = await axios({
            method: 'GET',
            url: hostname + '/games/all/',
            headers: { authorization: store.getState().auth.authenticated }
        });
        // get all games
        dispatch({ type: GET_ALL_GAMES });
        dispatch({ type: ALL_GAMES, payload: response.data.games });
    } catch (e) {
        console.log(e);
    }
}

/**
 * Adds the user to the game in the DB using the api.
 * @param {string} user - username
 * @param {string} userId - user id
 * @param {string} gameId - game id
 */
export const addUser = (user, userId, gameId) => async dispatch => {
    // add user to room
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/games/add/users',
            data: { user, userId, gameId },
            headers: { authorization: store.getState().auth.authenticated }
        });
        // add user
        dispatch({ type: UPDATE_USERS, payload: response.data.added });
    } catch (e) {
        console.log(e);
    }
}

/**
 * Removes the user from the game in the DB using the api.
 * @param {string} user - username
 * @param {string} gameId - game id
 * @param {string} nextUser - next user username
 */
export const removeUser = (user, gameId, nextUser) => async dispatch => {
    // remove user from room
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/games/remove/users',
            data: { user, gameId, nextUser },
            headers: { authorization: store.getState().auth.authenticated }
        });
        // remove user
        dispatch({ type: UPDATE_CURRENT_TURN, payload: response.data.removed.nextUser });
    } catch (e) {
        console.log(e);
    }
}

/**
 * Sets next player and updates phrase.
 * @param {string} user - next user
 * @param {string} gameId - the games id
 * @param {string} gameType - safe for work or not safe for work
 */
export const setCurrentTurn = (user, gameId, gameType) => async dispatch => {
    // get phrase
    let phrase = ''
    if (gameType === 'Safe For Work') {
        phrase = Phrases.clean[~~(Math.random() * Phrases.clean.length)];
    } else if (gameType === 'Not Safe For Work') {
        phrase = Phrases.dirty[~~(Math.random() * Phrases.dirty.length)];
    }

    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/games/game/turn',
            data: { user, gameId, phrase },
            headers: { authorization: store.getState().auth.authenticated }
        });
        // set current turn to response from server
        dispatch({ type: UPDATE_CURRENT_TURN, payload: response.data.turn });
        dispatch({ type: SET_PHRASE, payload: response.data.phrase });
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates the db with the card (gif) chosen by the jester(s) using the api.
 * @param {Object} card
 * @param {string} card.user - the users name
 * @param {string} card.card - the users gif
 * @param {string} card.gameId - the games id
 */
export const imgCardChosen = card => async () => {
    console.log('Card info:');
    console.log(card);
    socket.emit('card selected', card);
    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/games/update/cards',
            data: card,
            headers: { authorization: store.getState().auth.authenticated }
        });
        console.log(response.data.card);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates the db with the King's chosen Winner using the api.
 * @param {Object} winnerData - the winners data
 * @param {string} winnerData.user - the winners username
 * @param {string} winnerData.card - the winners card (gif)
 * @param {string} winnerData.gameId - the games id
 * @param {string} winnerData.nextUser - the next user to be king
 */
export const winnerChosen = (winnerData, gameType) => async () => {
    // get phrase
    let phrase = '';
    if (gameType === 'Safe For Work') {
        phrase = Phrases.clean[~~(Math.random() * Phrases.clean.length)];
    } else if (gameType === 'Not Safe For Work') {
        phrase = Phrases.dirty[~~(Math.random() * Phrases.dirty.length)];
    }
    winnerData.phrase = phrase;

    try {
        const response = await axios({
            method: 'POST',
            url: hostname + '/games/update/winner',
            data: winnerData,
            headers: { authorization: store.getState().auth.authenticated }
        });
        console.log(response.data.winner);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates and resets game state for next round.
 * @param {Object} r - the socket response object
 * @param {string} r.gameId - the games id
 * @param {string} r.user - the winners username
 * @param {string} r.phrase - the next phrase
 * @param {string} r.nextUser - the next user to be king
 * @param {string} r.card - the winners card (gif)
 */
export const afterWin = r => async dispatch => {
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
}
