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
    UPDATE_WINS,
    UPDATE_WINNER,
    UPDATE_WINNING_CARD,
    UPDATE_WINNER_CHOSEN,
    CLEAR_CARDS,
    CARD_SELECTED,
    SET_PHRASE
} from './types';
import io from 'socket.io-client';
import words from '../words/words-clean';

const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

export const setUserGifs = () => async dispatch => {
    try {
        let word = [];
        for (let i = 0; i < 3; i++) {
            word.push(words.words[~~(Math.random() * words.words.length)])
        }

        console.log('words===============================')
        console.log(word)
        let gifs = [];
        for (let i = 0; i < 3; i++) {
            // const gif = await axios.get(
            //     `https://api.tenor.com/v1/search?tag=${word[i]}&limit=1&media_filter=minimal&ar_range=standard&key=OZVKWPE1OFF3`
            // )
            // gifs.push(gif.data.results[0].media[0].tinygif.url);
            const gif = await axios.get(
                `https://api.giphy.com/v1/gifs/random?tag=${word[i]}&rating=r&api_key=kygFzz8jXFLD2kI2IsPll2kxWJjTeKxZ&limit=1`
            )
            console.log(gif.data.data.images.fixed_width.url)
            gifs.push(gif.data.data.images.fixed_width.url);
        }
        console.log('gifs================')
        console.log(gifs)
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
        console.log('user added ----->');
        console.log(response.data.added);
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

export const setCurrentTurn = (user, gameId) => async dispatch => {
    // get phrase
    const phrase = words.words[~~(Math.random() * words.words.length)];

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
        console.log('updateCards');
        console.log(response.data.card);
    } catch (e) {
        console.log(e);
    }
}

export const winnerChosen = winnerData => async () => {
    // get phrase
    const phrase = words.words[~~(Math.random() * words.words.length)];
    winnerData.phrase = phrase;

    try {
        const response = await axios.post(
            hostname + '/games/update/winner',
            winnerData
        );
        console.log('updateWinner');
        console.log(response.data.winner);
    } catch (e) {
        console.log(e);
    }
}

export const afterWin = r => async dispatch => {
    // update winner
    dispatch({ type: UPDATE_WINNER, payload: r.user });
    dispatch({ type: UPDATE_WINNING_CARD, payload: r.card });
    dispatch({ type: UPDATE_WINNER_CHOSEN, payload: true });
    // reset game
    setTimeout(() => {
        console.log('Next player is ---> ' + r.nextUser);
        // reset game for next round
        dispatch({ type: CLEAR_CARDS, payload: [] });
        dispatch({ type: UPDATE_WINNER_CHOSEN, payload: false });
        dispatch({ type: UPDATE_CURRENT_TURN, payload: r.nextUser });
        dispatch({ type: SET_PHRASE, payload: r.phrase });
        dispatch({ type: CARD_SELECTED, payload: false });
        // get new gifs
        setUserGifs();
        // is this still running multiple?
        dispatch({ type: UPDATE_WINS, payload: r.user });
    }, 3000);
}