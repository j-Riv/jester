import { ADD_CHAT } from '../actions/types';

const INITIAL_STATE = {
    chat: []
};

export default function (state = INITIAL_STATE, action) {
    console.log(action);
    switch (action.type) {
        case ADD_CHAT:
            return {
                ...state,
                chat: state.chat.concat(action.payload)
            };
        default:
            return state;
    }
}