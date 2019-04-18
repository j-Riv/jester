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
    CARD_SELECTED
} from './types';
import io from 'socket.io-client';
import words from '../words/words-clean';

const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

export const setUserGifs = (word, callback) => async dispatch => {
    try {
        let gifs = [];
        const gif1 = await axios.get(
            `https://api.tenor.com/v1/search?tag=${word[0]}&limit=1&media_filter=minimal&key=OZVKWPE1OFF3`
        )
        const gif2 = await axios.get(
            `https://api.tenor.com/v1/search?tag=${word[1]}&limit=1&media_filter=minimal&key=OZVKWPE1OFF3`
        )
        const gif3 = await axios.get(
            `https://api.tenor.com/v1/search?tag=${word[2]}&limit=1&media_filter=minimal&key=OZVKWPE1OFF3`
        )
        gifs.push(
            gif1.data.results[0].media[0].tinygif.url,
            gif2.data.results[0].media[0].tinygif.url,
            gif3.data.results[0].media[0].tinygif.url
        );
        console.log('gifs================')
        console.log(gifs)
        dispatch({ type: GET_GIFS, payload: gifs })
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
            hostname + '/games/new',
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
            hostname + '/games/game/' + id
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
            hostname + '/games/all/'
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

export const addUser = (user, gameId, callback) => async dispatch => {
    console.log(`Add user: ${user} to room: ${gameId}!`);
    try {
        const response = await axios.post(
            hostname + '/games/add/users',
            {user, gameId}
        );
        console.log('addUser');
        console.log(response.data.added.user);
        dispatch({ type: UPDATE_USERS, payload: response.data.added });
        callback(response.data.added);
    } catch (e) {
        console.log(e);
    }
}

export const removeUser = (user, gameId, nextUser, callback) => async dispatch => {
    console.log(`Removing user: ${user} from room: ${gameId}!`);
    try {
        const response = await axios.post(
            hostname + '/games/remove/users',
            { user, gameId, nextUser }
        );
        console.log('updateGameusers');
        console.log(response.data.removed.user);
        dispatch({ type: UPDATE_CURRENT_TURN, payload: response.data.removed.nextUser });
        callback(response.data.removed.user);
    } catch (e) {
        console.log(e);
    }
}

export const setCurrentTurn = (user, gameId) => async dispatch => {
    try {
        const response = await axios.post(
            hostname + '/games/game/turn',
            { user, gameId }
        );
        console.log('current turn update from server');
        console.log(response.data.turn);
        dispatch({ type: UPDATE_CURRENT_TURN, payload: response.data.turn });
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
        // dispatch({ type: UPDATE_IMAGES, payload: response.data.updatedGame.images });
    } catch (e) {
        console.log(e);
    }
}

export const winnerChosen = winnerData => async () => {
    console.log('Card info:');
    console.log(winnerData);
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
    // update wins
    // console.log('Updating winner: ' + response.user);
    // update winner
    dispatch({ type: UPDATE_WINS, payload: r.user });
    // console.log('Update winner socket');
    // console.log(r);
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
        dispatch({ type: CARD_SELECTED, payload: false });
        // get new gifs
        const newWord = [
            words.words[~~(Math.random() * words.words.length)],
            words.words[~~(Math.random() * words.words.length)],
            words.words[~~(Math.random() * words.words.length)]
        ];
        setUserGifs(newWord, (response) => {
            console.log('got new gifs');
            console.log(response);
        });
    }, 3000);
}