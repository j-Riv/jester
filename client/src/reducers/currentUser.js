import { 
    CURRENT_USER,
    CARD_SELECTED,
    GET_GIFS
} from '../actions/types';

const INITIAL_STATE = {
    user: localStorage.getItem('user')
};

export default function (state = INITIAL_STATE, action) {
    // console.log(action);
    switch (action.type) {
        case CURRENT_USER:
            return {
                ...state,
                user: action.payload
            };
        case GET_GIFS:
        console.log(action.payload)
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
        default:
            return state;
    }
}