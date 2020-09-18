import { ModalOpen, ModalClose } from '../actions';
import { combineReducers } from 'redux';

const counterInitialState = {
    displayStatus: 'none',
    text : '',
    topPosition: -100,
    addClass: '',
};

const modal = (state = counterInitialState, action) => {
    switch(action.type) {

        case ModalOpen:
            return Object.assign({}, state, {
                displayStatus: 'block',
                text : action.text,
                topPosition: action.topPosition,
                addClass : action.addClass,
            });

        case ModalClose:
            return Object.assign({}, state, {
                displayStatus: 'none',
            });
        default:
            return state;
    }
};


// const extra = (state = { value: 'this_is_extra_reducer' }, action) => {
//     switch(action.type) {
//         default:
//             return state;
//     }
// };

const counterApp = combineReducers({
    modal,
    //extra
});

export default counterApp;