import { 
    CURRENT_USER,
    USER_GIFS,
    CARD_SELECTED,
    UPDATE_WINS
} from '../actions/types';

const INITIAL_STATE = {
    user: localStorage.getItem('user')
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
    switch (action.type) {
        case CURRENT_USER:
            return {
                ...state,
                user: action.payload
            };
        case USER_GIFS:
            return {
                ...state,
                user: {
                    ...state.user,
                    images: action.payload
                }
            };
        case CARD_SELECTED:
            return {
                ...state,
                user: {
                    ...state.user,
                    card_selected: action.payload
                }
            };
        case UPDATE_WINS:
            const wins = state.user.wins + 1;
            return {
                ...state,
                user: {
                    ...state.user,
                    wins: wins
                }
            }
        default:
            return state;
    }
}