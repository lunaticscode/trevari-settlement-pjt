
import {ModalOpen, ModalClose, ClickLink} from '../actions';
import { LeftSwipe, RightSwipe } from "../actions";
import {MaskOpen, MaskClose} from "../actions"
import {CommonModalOpen, CommonModalClose} from "../actions";
import {InfoModalOpen, InfoModalClose} from "../actions";

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

const maskInitialState = {
    maskStatus: 'none',
};

const commonModalInitialState = {
    displayStatus: 'none',
    mood: '',
    text: '',
};

const infoModalInitialState = {
    displayStatus: 'none',
    modalInfo: {},
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
            return Object.assign({}, state, {
                direction: 'left',
                nowPage : action.nowPage,
            });
        case RightSwipe:
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

const mask = (state = maskInitialState, action ) => {
    switch (action.type) {
        case MaskOpen:
            return Object.assign({}, state, {
                maskStatus : 'block',
            });
        case MaskClose:
            return Object.assign({}, state, {
                maskStatus: 'none',
            });
        default:
            return state;
    }
};

const commonModal = (state = commonModalInitialState, action) => {
    switch(action.type) {
        case CommonModalOpen:
            return Object.assign({}, state, {
               displayStatus: 'block',
               text: action.text,
               mood: action.mood,
            });
        case CommonModalClose:
            return Object.assign({}, state, {
                displayStatus: 'none',
            });
        default:
            return state;
    }
};

const infomodal = (state = infoModalInitialState, action) => {
    switch(action.type) {
        case InfoModalOpen:
            return Object.assign({}, state, {
                displayStatus: 'block',
                info: action.info,
            });
        case InfoModalClose:
            return Object.assign({}, state, {
                displayStatus: 'none',
            });
        default:
            return state;
    }
};

const counterApp = combineReducers({
    modal, pageChange,
    mask, infomodal, commonModal,
});

export default counterApp;