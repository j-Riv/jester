import { CURRENT_GAME, ADD_CHAT } from '../actions/types';

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
        default:
            return state;
    }
}