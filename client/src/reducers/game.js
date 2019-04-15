import { 
    CURRENT_GAME, 
    ADD_CHAT, 
    GET_GIFS,
    UPDATE_USERS,
    UPDATE_CARDS
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
            return {
                ...state,
                game: {
                    ...state.game,
                    images: [
                        ...state.game.images,
                        action.payload
                    ]
                }
            };
        default:
            return state;
    }
}