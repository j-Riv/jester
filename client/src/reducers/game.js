import { CURRENT_GAME, ADD_CHAT, GET_GIFS } from '../actions/types';

const INITIAL_STATE = {
    game: []
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
        console.log('setting gifs into state')
        console.log(action.payload);
        console.log('end of state set');
            return {
                ...state,
                game: {
                    ...state.game,
                    images: action.payload
                }
            }
        default:
            return state;
    }
}