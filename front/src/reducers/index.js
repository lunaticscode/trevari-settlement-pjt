import {ModalOpen, ModalClose, ClickLink} from '../actions';
import { LeftSwipe, RightSwipe } from "../actions";
import { combineReducers } from 'redux';

const counterInitialState = {
    displayStatus: 'none',
    text : '',
    topPosition: -100,
    addClass: '',
};

const pageStackInitialState = {
    direction: null,
    nowPage : ( localStorage.getItem("PageStack") ) ? localStorage.getItem("PageStack").split(',')[0] : '/',
};

const modal = (state = counterInitialState, action) => {
    switch(action.type) {
        case ModalOpen:
            return Object.assign({}, state, {
                displayStatus: 'block',
                text : action.text,
                topPosition: action.topPosition,
                animationClass : 'slide-from-left',
            });
        case ModalClose:
            return Object.assign({}, state, {
                displayStatus: 'block',
                animationClass: 'fadeout',
            });
        default:
            return state;
    }
};

const pageChange = (state = pageStackInitialState, action) => {
    switch (action.type) {
        case LeftSwipe:
            //console.log(state);
            return Object.assign({}, state, {
                direction: 'left',
                nowPage : action.nowPage,
            });
        case RightSwipe:
            //console.log(state);
            return Object.assign( {}, state,  {
                direction: 'right',
                nowPage : action.nowPage,
            });

        case ClickLink:
            return Object.assign({}, state, {
                direction: 'click',
                nowPage: action.nowPage,
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
    modal, pageChange,
    //extra
});

export default counterApp;