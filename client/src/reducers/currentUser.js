import { 
    CURRENT_USER,
    CARD_SELECTED,
    GET_GIFS,
    UPDATE_AND_RESET,
    UPDATE_PICTURE
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
        case UPDATE_AND_RESET:
            return {
                ...state,
                user: {
                    ...state.user,
                    card_selected: false
                }
            };
        case UPDATE_PICTURE:
            return {
                ...state,
                user: {
                    ...state.user,
                    picture: action.payload
                }
            }
        default:
            return state;
    }
}