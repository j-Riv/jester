import { CURRENT_USER } from '../actions/types';

const INITIAL_STATE = {
    user: ''
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
    switch (action.type) {
        case CURRENT_USER:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
}