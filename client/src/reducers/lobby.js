import { ALL_GAMES} from '../actions/types';

const INITIAL_STATE = {
    games: []
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
    switch (action.type) {
        case ALL_GAMES:
            return {
                ...state,
                games: action.payload
            };
        default:
            return state;
    }
}