import { 
    CURRENT_USER,
    CARD_SELECTED,
    GET_GIFS,
    UPDATE_WINNER,
    UPDATE_AND_RESET
} from '../actions/types';

const INITIAL_STATE = {
    // user: localStorage.getItem('user')
    user: {
        _id: '',
        email: '',
        username: '',
        picture: '',
        images: [],
        card_selected: false
    }
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CURRENT_USER:
            return {
                ...state,
                user: action.payload
            };
        case GET_GIFS:
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
        case UPDATE_WINNER:
            return {
                ...state,
                user: {
                    ...state.user,
                    images: action.payload.gifs
                }
            }
        case UPDATE_AND_RESET:
        console.log('UPDATE AND RESET');
        console.log(action.payload.gifs);
            return {
                ...state,
                user: {
                    ...state.user,
                    card_selected: false
                }
            }
        default:
            return state;
    }
}