import { 
    CURRENT_GAME, 
    ADD_CHAT, 
    UPDATE_USERS,
    REMOVE_USER,
    UPDATE_CARDS,
    UPDATE_WINNER,
    UPDATE_WINNING_CARD,
    UPDATE_WINNER_CHOSEN,
    UPDATE_CURRENT_TURN,
    CLEAR_CARDS,
    UPDATE_WINS
} from '../actions/types';

const INITIAL_STATE = {
    game: {
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
            if(!UserExists) {
                console.log('User doesnt exist lets add them');
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
        case UPDATE_WINS:
            let updateWins = state.game.users.slice();
            console.log('UPDATE_WINS');
            updateWins.forEach(obj => {
                console.log('user: ' + obj.user);
                console.log('Winning user: ' + action.payload);
                if (obj.user === action.payload) {
                    obj.wins++;
                }
            });
            return {
                ...state,
                user: {
                    ...state.game,
                    users: updateWins
                }
            };
        case UPDATE_CARDS:
            let AlreadyExists = state.game.images.some(el => el.user === action.payload.user);
            let chosenImages = state.game.images.slice();
            if(!AlreadyExists) {
                console.log('image doesnt exist');
                chosenImages.push(action.payload);
            }
            return {
                ...state,
                game: {
                    ...state.game,
                    images: chosenImages
                }
            };
        case CLEAR_CARDS:
            return {
                ...UPDATE_CARDS,
                game: {
                    ...state.game,
                    images: action.payload
                }
            }
        case UPDATE_WINNER:
            return {
                ...state,
                game: {
                    ...state.game,
                    winner: action.payload
                }
            };
        case UPDATE_WINNING_CARD:
            return {
                ...state,
                game: {
                    ...state.game,
                    winning_card: action.payload
                }
            };
        case UPDATE_WINNER_CHOSEN:
            return {
                ...state,
                game: {
                    ...state.game,
                    winner_chosen: action.payload
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
        default:
            return state;
    }
}

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