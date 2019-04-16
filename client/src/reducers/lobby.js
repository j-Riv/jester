import { 
    GET_ALL_GAMES,
    ALL_GAMES,
    GET_GAMES_FAILURE
} from '../actions/types';

const INITIAL_STATE = {
    games: {
        all: [],
        loading: false,
        error: null
    }
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
    switch (action.type) {
        case GET_ALL_GAMES:
            return {
                ...state,
                games: {
                    ...state.games,
                    loading: true,
                    error: null
                }
            };
        case ALL_GAMES:
            return {
                ...state,
                games: {
                    ...state.games,
                    all: action.payload,
                    loading: false
                }
            };
        case GET_GAMES_FAILURE:
            return {
                ...state,
                games: {
                    ...state.games,
                    loading: false,
                    error: action.payload.error,
                    all: []
                }
            };
        default:
            return state;
    }
}