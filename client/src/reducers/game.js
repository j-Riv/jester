import { 
    CURRENT_GAME, 
    ADD_CHAT, 
    UPDATE_USERS,
    REMOVE_USER,
    UPDATE_CARDS,
    UPDATE_WINNER,
    UPDATE_CURRENT_TURN,
    SET_PHRASE,
    UPDATE_AND_RESET
} from '../actions/types';

const INITIAL_STATE = {
    game: {
        phrase: '',
        users: [],
        current_turn: '',
        images: [],
        messages: [],
        username: '',
        user_pic: '',
        game_name: '',
        max_players: 5,
        category: '',
        status: '',
        winner: '',
        winning_card: '',
        winner_chosen: false
    }
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CURRENT_GAME:
            return {
                ...state,
                game: action.payload
            };
        case SET_PHRASE:
            return {
                ...state,
                game: {
                    ...state.game,
                    phrase: action.payload
                }
            };
        case ADD_CHAT:
            return {
                ...state,
                game: {
                    ...state.game,
                    messages: [
                        ...state.game.messages,
                        action.payload
                    ]
                }
            };
        case UPDATE_USERS:
            let UserExists = state.game.users.some(e => e.user === action.payload.user);
            let users = state.game.users.slice();
            if (!UserExists) {
                users.push(action.payload);
            }
            return {
                ...state,
                game: {
                    ...state.game,
                    users: users
                }
            };
        case REMOVE_USER:
            let userList = state.game.users.slice();
            let removed = removeByKey(userList, { key: 'user', value: action.payload });
            return {
                ...state,
                game: {
                    ...state.game,
                    users: removed
                }
            };
        case UPDATE_CARDS:
            let AlreadyExists = state.game.images.some(el => el.user === action.payload.user);
            let chosenImages = state.game.images.slice();
            if (!AlreadyExists) {
                chosenImages.push(action.payload);
            }
            return {
                ...state,
                game: {
                    ...state.game,
                    images: chosenImages
                }
            };
        case UPDATE_WINNER:
            return {
                ...state,
                game: {
                    ...state.game,
                    winner: action.payload.user,
                    winning_card: action.payload.card,
                    winner_chosen: true
                }
            };
        case UPDATE_CURRENT_TURN:
            return {
                ...state,
                game: {
                    ...state.game,
                    current_turn: action.payload
                }
            }
        case UPDATE_AND_RESET:
            let updateWins = state.game.users.slice();
            updateWins.forEach(obj => {
                if (obj.user === action.payload.user) {
                    obj.wins++;
                }
            });
            return {
                ...state,
                game: {
                    ...state.game,
                    phrase: action.payload.phrase,
                    current_turn: action.payload.nextUser,
                    images: [],
                    users: updateWins,
                    winner_chosen: false
                }
            }
        default:
            return state;
    }
}

/**
 * Remove user from users in game
 * @param {array} array - all users in current game
 * @param {object} params
 * @param {string} params.key - the key to use
 * @param {string} params.value - the username to look for
 * @return {array} - returns all users in current game
 */
function removeByKey(array, params) {
    array.some(function (item, index) {
        if (array[index][params.key] === params.value) {
            // found it!
            array.splice(index, 1);
            return true; // stops the loop
        }
        return false;
    });
    return array;
}