import { 
    CURRENT_GAME, 
    ADD_CHAT, 
    GET_GIFS,
    UPDATE_USERS,
    UPDATE_CARDS,
    UPDATE_WINNER,
    UPDATE_WINNING_CARD,
    UPDATE_WINNER_CHOSEN,
    UPDATE_CURRENT_TURN,
    CLEAR_CARDS
} from '../actions/types';

const INITIAL_STATE = {
    game: localStorage.getItem('game')
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
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
        case GET_GIFS:
            return {
                ...state,
                game: {
                    ...state.game,
                    images: action.payload
                }
            };
        case UPDATE_USERS:
            return {
                ...state,
                game: {
                    ...state.game,
                    users: action.payload
                }
            };
        case UPDATE_CARDS:
            let AlreadyExists = state.game.images.some(el => el.user === action.payload.user);
            let chosenImages = state.game.images.slice();
            if(!AlreadyExists) {
                console.log('doesnt exist');
                chosenImages.push(action.payload);
            }
            return {
                ...state,
                game: {
                    ...state.game,
                    images: chosenImages
                }
                // game: {
                //     ...state.game,
                //     images: [
                //         ...state.game.images,
                //         action.payload
                //     ]
                // }
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