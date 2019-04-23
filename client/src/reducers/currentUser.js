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
                    images: [
                        "https://media2.giphy.com/media/Se2X2MM8N4HPa/200w.gif",
                        "https://media0.giphy.com/media/2SXRjxjXDZhKcOmKcH/200w.gif",
                        "https://media3.giphy.com/media/FyH83LEK2hytq/200w.gif"
                    ]
                }
            }
        case UPDATE_AND_RESET:
        console.log('UPDATE AND RESET');
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