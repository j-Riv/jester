import { SET_COLOR } from '../actions/types';

const INITIAL_STATE = {
    color: 'black'
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
    switch (action.type) {
        case SET_COLOR:
            return {
                ...state,
                color: action.payload
            };
        default:
            return state;
    }
}