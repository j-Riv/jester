import { 
    CURRENT_USER,
    USER_GIFS 
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
            }
        default:
            return state;
    }
}